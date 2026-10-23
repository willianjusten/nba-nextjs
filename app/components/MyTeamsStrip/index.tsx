import Link from "next/link";
import type { MyTeamLink } from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";
import TeamLogo from "@/app/components/TeamLogo";

const STANDINGS_HREF = "/standings";
// The desktop size; the logo shrinks to 24px on mobile through CSS.
const LOGO_SIZE = 28;

const FOCUS_RING_CLASS_NAME =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type MyTeamsStripProps = {
  // Null while the favorites resolve; the strip keeps its height so the page doesn't jump.
  teams: MyTeamLink[] | null;
};

function MyTeamPill({ team }: { team: MyTeamLink }) {
  return (
    // A logo and name pill on mobile, a round logo on desktop, as the two artboards draw it.
    <Link
      href={team.href}
      aria-label={team.displayName}
      className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-favorite/40 bg-favorite/10 py-1 pr-3 pl-1.5 text-xs font-bold transition-colors hover:bg-favorite/18 md:size-11 md:justify-center md:p-0 ${FOCUS_RING_CLASS_NAME}`}
    >
      <span className="flex *:size-6 md:*:size-7">
        <TeamLogo logoUrl={team.logoUrl} size={LOGO_SIZE} />
      </span>
      <span aria-hidden="true" className="md:hidden">
        {team.name}
      </span>
    </Link>
  );
}

function AddTeamLink({ hiddenOnDesktop }: { hiddenOnDesktop: boolean }) {
  return (
    <Link
      href={STANDINGS_HREF}
      aria-label={strings.myTeams.add}
      className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-white/24 text-muted transition-colors hover:bg-white/5 hover:text-foreground ${hiddenOnDesktop ? "md:hidden" : ""} ${FOCUS_RING_CLASS_NAME}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="size-4"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  );
}

export default function MyTeamsStrip({ teams }: MyTeamsStripProps) {
  const hasTeams = teams !== null && teams.length > 0;

  return (
    <nav
      aria-label={strings.myTeams.label}
      className="flex min-h-11 items-center gap-2 overflow-x-auto"
    >
      <span
        aria-hidden="true"
        className="shrink-0 text-[10px] tracking-[0.16em] text-muted uppercase"
      >
        {strings.myTeams.label}
      </span>
      {teams?.map((team) => (
        <MyTeamPill key={team.teamId} team={team} />
      ))}
      {/* The desktop artboard drops the add button once there are favorites; mobile keeps it at the end. */}
      {teams && <AddTeamLink hiddenOnDesktop={hasTeams} />}
    </nav>
  );
}
