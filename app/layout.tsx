import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header, Footer } from "@/app/components";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
        <div className="bg-layout">
          <div className="z-[1] flex flex-grow flex-col">
            <Header />
            <main className="container mx-auto flex-grow px-4">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}