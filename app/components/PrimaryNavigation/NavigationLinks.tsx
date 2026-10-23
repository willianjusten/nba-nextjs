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
        <ul className="flex gap-1">
          {sections.map((section) => (
            <li key={section.href}>
              <PillLink
                section={section}
                isActive={isSectionActive(section, pathname)}
              />
            </li>
          ))}
        </ul>
      </nav>
      <nav
        aria-label={strings.shell.bottomNavigation}
        className="fixed inset-x-0 bottom-0 z-10 border-t border-white/8 bg-linear-to-b from-ink/40 to-ink to-42% px-4 pt-2.5 pb-[max(1.125rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <ul className="flex gap-1">
          {sections.map((section) => (
            <li key={section.href} className="flex-1">
              <TabLink
                section={section}
                isActive={isSectionActive(section, pathname)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

type SectionLinkProps = {
  section: NavigationSection;
  isActive: boolean;
};

function pillStateClassName(section: NavigationSection, isActive: boolean) {
  if (isActive) {
    return `border-accent/40 bg-accent/14 font-bold text-accent-soft ${section.seasonal ? "border-dashed" : ""}`;
  }
  return section.seasonal
    ? "border-dashed border-white/18 text-muted hover:bg-white/6"
    : "border-transparent text-secondary hover:bg-white/6";
}

function PillLink({ section, isActive }: SectionLinkProps) {
  return (
    <Link
      href={section.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors ${pillStateClassName(section, isActive)}`}
    >
      {section.label}
    </Link>
  );
}

function TabLink({ section, isActive }: SectionLinkProps) {
  const stateClassName = isActive
    ? "font-bold text-accent"
    : "font-medium text-muted";
  const seasonalClassName = section.seasonal
    ? "border-dashed border-white/18"
    : "border-transparent";

  return (
    <Link
      href={section.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-tile border text-[10px] tracking-[0.08em] transition-colors ${stateClassName} ${seasonalClassName}`}
    >
      <SectionIcon section={section} />
      {section.label}
    </Link>
  );
}

const SECTION_ICON_SHAPES: Record<NavigationSection["id"], React.ReactNode> = {
  games: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M5 6c4 2 10 2 14 0M5 18c4-2 10-2 14 0" />
    </>
  ),
  standings: <path d="M5 20V10M12 20V4M19 20v-7" />,
  playoffs: (
    <path d="M4 5h5v6H4zM4 15h5v4H4zM15 5h5v4h-5zM15 13h5v6h-5zM9 8h6M9 17h6" />
  ),
};

function SectionIcon({ section }: { section: NavigationSection }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-5"
    >
      {SECTION_ICON_SHAPES[section.id]}
    </svg>
  );
}
