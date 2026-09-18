import { createHmac } from "node:crypto";
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
 * The second reason is the JWT. Signing has to happen somewhere the shared
 * secret can live, and anything shipped to the browser is public — a token
 * minted client-side would hand every visitor the ability to post whatever
 * they liked to the n8n workflow.
 *
 * Configuration lives in the environment, in one place:
 *
 *   INQUIRY_WEBHOOK_URL         the n8n production webhook (`/webhook/...`, not
 *                               `/webhook-test/...` — the test URL is
 *                               single-shot and 404s until you click "Listen"
 *                               again)
 *   INQUIRY_WEBHOOK_JWT_SECRET  optional; when set, each request carries a
 *                               freshly signed HS256 bearer token. Must match
 *                               the secret on n8n's JWT Auth credential.
 *   INQUIRY_WEBHOOK_SECRET      optional; sent as `X-Webhook-Secret`. Predates
 *                               the JWT and is kept for receivers that check
 *                               a plain shared header instead.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_URL = process.env.INQUIRY_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.INQUIRY_WEBHOOK_SECRET;
const WEBHOOK_JWT_SECRET = process.env.INQUIRY_WEBHOOK_JWT_SECRET;

/** Seconds a minted token stays valid. Short: it is used immediately. */
const JWT_TTL_SECONDS = 300;

/** Where submissions are mirrored locally, so nothing is lost if n8n is down. */
const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "inquiries.jsonl");

interface InquiryPayload {
  name: string;
  email: string;
  villa?: string;
  arrival?: string;
  departure?: string;
  guests?: string;
  message?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mints an HS256 JWT.
 *
 * Hand-rolled rather than pulling in `jsonwebtoken`: HS256 is a base64url
 * header, a base64url payload, and an HMAC over the two joined by a dot.
 * Signing is the easy half of JWT — the part worth a library is *verifying*
 * one, which is n8n's job here, not ours.
 */
function signJwt(payload: Record<string, unknown>, secret: string): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

  const signingInput = `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}`;
  const signature = createHmac("sha256", secret)
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
}

/**
 * Nights between two `YYYY-MM-DD` dates.
 *
 * Both sides are parsed as midnight UTC so the subtraction can't be thrown off
 * by a DST boundary falling inside the stay.
 */
function nightsBetween(arrival?: string, departure?: string): number | undefined {
  if (!arrival || !departure) return undefined;

  const from = Date.parse(`${arrival}T00:00:00Z`);
  const to = Date.parse(`${departure}T00:00:00Z`);

  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) return undefined;

  return Math.round((to - from) / 86_400_000);
}

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
      villa: str("villa") || undefined,
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
    // Derived here rather than in n8n so the workflow doesn't have to do date
    // maths to answer the first question any booking raises.
    nights: nightsBetween(result.data.arrival, result.data.departure),
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

  // Minted per request and valid for minutes, so a token captured in transit
  // is worthless almost immediately.
  const now = Math.floor(Date.now() / 1000);
  const token = WEBHOOK_JWT_SECRET
    ? signJwt(
        {
          iss: "nirvana-tamarindo.com",
          sub: "booking-inquiry",
          iat: now,
          exp: now + JWT_TTL_SECONDS,
        },
        WEBHOOK_JWT_SECRET,
      )
    : null;

  if (!token) {
    console.warn(
      "[inquiry] INQUIRY_WEBHOOK_JWT_SECRET is not set — posting unauthenticated.",
    );
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
