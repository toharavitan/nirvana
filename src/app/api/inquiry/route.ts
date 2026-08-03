import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

/**
 * Booking inquiry endpoint.
 *
 * The browser posts here and this route forwards to the webhook. It is not
 * routed through the client for a reason: webhook receivers (n8n, Zapier, Make)
 * don't return CORS headers, so a `fetch` straight from the page fails in the
 * browser even when the same request succeeds from curl.
 *
 * Configuration lives in the environment, in one place:
 *
 *   INQUIRY_WEBHOOK_URL     the n8n production webhook (`/webhook/...`, not
 *                           `/webhook-test/...` — the test URL is single-shot
 *                           and 404s until you click "Listen" again)
 *   INQUIRY_WEBHOOK_SECRET  optional; sent as `X-Webhook-Secret`
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_URL = process.env.INQUIRY_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.INQUIRY_WEBHOOK_SECRET;

/** Where submissions are mirrored locally, so nothing is lost if n8n is down. */
const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "inquiries.jsonl");

interface InquiryPayload {
  name: string;
  email: string;
  arrival?: string;
  departure?: string;
  guests?: string;
  message?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: unknown): { data: InquiryPayload } | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Malformed request body." };
  }

  const raw = body as Record<string, unknown>;
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  const name = str("name");
  const email = str("email");

  if (name.length < 2) return { error: "Please give us a name." };
  if (!EMAIL.test(email)) return { error: "That email address doesn't look right." };

  // A hidden field real people never fill in. Bots fill in everything.
  if (str("company")) return { error: "Rejected." };

  return {
    data: {
      name,
      email,
      arrival: str("arrival") || undefined,
      departure: str("departure") || undefined,
      guests: str("guests") || undefined,
      message: str("message") || undefined,
    },
  };
}

/**
 * Best-effort local mirror. Serverless filesystems are read-only, so a failure
 * here is expected in production and must never take the request down with it.
 */
async function mirror(record: unknown): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${JSON.stringify(record)}\n`, "utf8");
  } catch {
    // Intentionally swallowed — see above.
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const result = validate(body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const record = {
    ...result.data,
    submittedAt: new Date().toISOString(),
    source: "nirvana-tamarindo.com",
  };

  await mirror(record);

  if (!WEBHOOK_URL) {
    // Deliberately still a success for the visitor: their details are on disk
    // and the missing configuration is an operator problem, not theirs.
    console.warn(
      "[inquiry] INQUIRY_WEBHOOK_URL is not set — submission stored locally only.",
    );
    return NextResponse.json({ received: true, webhookStatus: "not-configured" });
  }

  let webhookStatus: number | string;

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(WEBHOOK_SECRET ? { "X-Webhook-Secret": WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(10_000),
    });

    webhookStatus = response.status;

    if (!response.ok) {
      console.error(
        `[inquiry] webhook returned ${response.status}: ${await response.text()}`,
      );
    }
  } catch (error) {
    webhookStatus = "unreachable";
    console.error("[inquiry] webhook request failed:", error);
  }

  // The visitor's success state is not conditional on a downstream integration
  // being healthy — the submission is already recorded either way.
  return NextResponse.json({ received: true, webhookStatus });
}
