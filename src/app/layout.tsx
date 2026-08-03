import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SmoothScrollProvider } from "@leadstrikes/motion-engine";

import { site } from "@/content/site";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} — ${site.location.town}, ${site.location.country}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.fullName,
    description: site.description,
    type: "website",
    locale: "en_US",
    siteName: site.fullName,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#14191a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Entrance animations start from opacity 0. Without this the server HTML
          paints at full opacity for a frame before GSAP takes over, which reads
          as a flash. Setting the flag here — synchronously, before first paint —
          lets globals.css hide those elements, and the class is only ever added
          when scripting is available, so content can never be stranded hidden.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="bg-bone text-ink">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
