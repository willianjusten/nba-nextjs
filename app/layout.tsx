import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { Header, Footer } from "@/app/components";
import NProgressProvider from "@/app/components/NProgressProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nba.willianjusten.com.br"),
  title: "Games for today | NBA Next.js",
  description: "See NBA game results and standings powered by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NProgressProvider>
          <div className="bg-layout">
            <div className="z-[1] flex flex-grow flex-col">
              <Header />
              <main className="container mx-auto flex flex-grow flex-col px-4">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </NProgressProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
