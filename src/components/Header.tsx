"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const linkClass =
    "text-lg transition-opacity hover:opacity-70 border-b-2 border-transparent hover:border-blue-300";
  const activeLinkClass =
    "text-lg transition-opacity hover:opacity-70 border-b-2 border-blue-500";

  return (
    <header className="container mx-auto flex items-center justify-between px-4 py-8">
      <Link href="/">
        <Image
          className="w-24"
          src="/images/nba-logo.svg"
          alt="NBA NextJS"
          width={96}
          height={56}
        />
      </Link>

      <nav className="flex gap-6">
        <Link
          className={pathname === "/" ? activeLinkClass : linkClass}
          href="/">
          Home
        </Link>
        <Link
          className={pathname === "/standings" ? activeLinkClass : linkClass}
          href="/standings">
          Standings
        </Link>
      </nav>
    </header>
  );
}
