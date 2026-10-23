"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  isSectionActive,
  navigationSections,
  type NavigationSection,
} from "@/app/components/PrimaryNavigation/sections";
import { strings } from "@/app/lib/strings";

type NavigationLinksProps = {
  showPlayoffs: boolean;
};

export default function NavigationLinks({
  showPlayoffs,
}: NavigationLinksProps) {
  const pathname = usePathname();
  const sections = navigationSections(showPlayoffs);

  return (
    <>
      <nav
        aria-label={strings.shell.primaryNavigation}
        className="hidden md:block"
      >
        <ul className="flex gap-2">
          {sections.map((section) => (
            <li key={section.href}>
              <NavigationLink
                section={section}
                isActive={isSectionActive(section, pathname)}
                className="min-h-11 rounded-full px-4 transition-colors hover:bg-white/10"
                activeClassName="bg-white/15 text-white"
                inactiveClassName="text-slate-300"
              />
            </li>
          ))}
        </ul>
      </nav>
      <nav
        aria-label={strings.shell.bottomNavigation}
        className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-slate-900/95 backdrop-blur md:hidden"
      >
        <ul className="flex">
          {sections.map((section) => (
            <li key={section.href} className="flex-1">
              <NavigationLink
                section={section}
                isActive={isSectionActive(section, pathname)}
                className="min-h-14 justify-center text-sm"
                activeClassName="text-white"
                inactiveClassName="text-slate-400"
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

type NavigationLinkProps = {
  section: NavigationSection;
  isActive: boolean;
  className: string;
  activeClassName: string;
  inactiveClassName: string;
};

function NavigationLink({
  section,
  isActive,
  className,
  activeClassName,
  inactiveClassName,
}: NavigationLinkProps) {
  return (
    <Link
      href={section.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center font-semibold ${className} ${isActive ? activeClassName : inactiveClassName}`}
    >
      {section.label}
    </Link>
  );
}
