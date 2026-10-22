import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/app/providers";
import { strings } from "@/app/lib/strings";

import "./globals.css";

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
          <div className="bg-layout">
            <main className="z-1 container mx-auto flex grow flex-col px-4">
              {children}
            </main>
          </div>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
