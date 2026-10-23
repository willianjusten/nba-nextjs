import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/app/providers";
import AppFooter from "@/app/components/AppFooter";
import AppHeader from "@/app/components/AppHeader";
import { strings } from "@/app/lib/strings";

import "./globals.css";

// The navigation reads today's live scoreboard to decide on the Playoffs tab, so no page can be prerendered at build time.
export const dynamic = "force-dynamic";

// next/font self-hosts the files and sizes a fallback to each font's metrics, so swapping fonts does not shift the layout.
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nba.willianjusten.com.br"),
  title: strings.app.name,
  description: strings.app.description,
};

export const viewport: Viewport = {
  themeColor: "#080b14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans">
        <Providers>
          {/* Bottom padding on mobile keeps the fixed bottom navigation from covering the footer. */}
          <div className="relative flex min-h-screen flex-col overflow-x-clip pb-20 md:pb-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 -right-30 size-95 rounded-full bg-[radial-gradient(circle,rgb(255_122_51/0.22)_0%,transparent_70%)] md:-top-70 md:-right-45 md:size-205"
            />
            <AppHeader />
            <main className="relative container mx-auto flex grow flex-col px-4">
              {children}
            </main>
            <AppFooter />
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
