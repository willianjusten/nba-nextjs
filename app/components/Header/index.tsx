"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const commonClass = "text-lg transition-opacity hover:opacity-70 border-b-2";
const linkClass = `${commonClass} border-transparent hover:border-blue-300`;
const activeLinkClass = `${commonClass} border-blue-500`;

function Header() {
  const pathname = usePathname();

  return (
    <header className="container mx-auto flex items-center justify-between px-4 py-8">
      <Link href="/">
        <Image
          className="w-24"
          src="/images/nba-logo.svg"
          alt="NBA NextJS"
          width={96}
          height={56}
          priority
        />
      </Link>

      <nav className="flex gap-6">
        <Link
          className={
            pathname === "/" || pathname.includes("/games/")
              ? activeLinkClass
              : linkClass
          }
          href="/"
        >
          Home
        </Link>
        <Link
          className={pathname === "/standings" ? activeLinkClass : linkClass}
          href="/standings"
        >
          Standings
        </Link>
        <Link
          className={pathname === "/playoffs" ? activeLinkClass : linkClass}
          href="/playoffs"
        >
          Playoffs
        </Link>
      </nav>
    </header>
  );
}

export default Header;
