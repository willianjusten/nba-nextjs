import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/app/providers";
import AppFooter from "@/app/components/AppFooter";
import AppHeader from "@/app/components/AppHeader";
import { strings } from "@/app/lib/strings";

import "./globals.css";

// The navigation reads today's live scoreboard to decide on the Playoffs tab, so no page can be prerendered at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://nba.willianjusten.com.br"),
  title: strings.app.name,
  description: strings.app.description,
};

export const viewport: Viewport = {
  themeColor: "rgb(14 25 44 / 30%)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          {/* Bottom padding on mobile keeps the fixed bottom navigation from covering the footer. */}
          <div className="bg-layout pb-14 md:pb-0">
            <AppHeader />
            <main className="z-1 container mx-auto flex grow flex-col px-4">
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
