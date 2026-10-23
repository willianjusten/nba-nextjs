"use client";

import Link from "next/link";
import { FOCUS_RING_CLASS_NAME } from "@/app/components/DatePicker/DatePickerTrigger";
import TeamLogo from "@/app/components/TeamLogo";
import type { ConferenceStandings } from "@/app/lib/domain/standings";
import { useFavoriteTeamIds } from "@/app/lib/favorites/use-favorite-team-ids";
import {
  buildSidebarStandings,
  type SidebarStandingsRow,
  type StreakKind,
} from "@/app/lib/home/sidebar";
import { strings } from "@/app/lib/strings";
import { PANEL_HEADING_CLASS_NAME, PANEL_SURFACE_CLASS_NAME } from "./styles";

const LOGO_SIZE = 22;
const HEADING_ID = "sidebar-standings";

const STREAK_CLASS_NAME: Record<StreakKind, string> = {
  win: "text-win",
  loss: "text-live",
};

function StandingsPanelRow({ row }: { row: SidebarStandingsRow }) {
  return (
    <li>
      <Link
        href={row.href}
        className={`grid min-h-10 grid-cols-[24px_1fr_52px_44px] items-center gap-2 rounded-[10px] px-1.5 py-0.5 transition-colors hover:bg-white/5 ${row.isFavorite ? "bg-favorite/8" : ""} ${FOCUS_RING_CLASS_NAME}`}
      >
        <span className="flex size-6 items-center justify-center rounded-lg border border-playoff/45 bg-playoff/18 font-display text-sm text-foreground">
          {row.seed}
        </span>
        <span className="flex min-w-0 items-center gap-2">
          <TeamLogo logoUrl={row.logoUrl} size={LOGO_SIZE} lazy />
          <span className="truncate text-sm">{row.name}</span>
          {row.isFavorite && (
            <span className="sr-only">{strings.home.sidebar.favorite}</span>
          )}
        </span>
        <span className="text-right font-display text-base">{row.record}</span>
        <span
          className={`text-right text-xs font-bold ${row.streakKind ? STREAK_CLASS_NAME[row.streakKind] : "text-muted"}`}
        >
          {row.streak ?? strings.standings.noStreak}
        </span>
      </Link>
    </li>
  );
}

export default function StandingsPanel({
  // null when the standings could not be loaded.
  conferences,
}: {
  conferences: ConferenceStandings[] | null;
}) {
  const favoriteTeamIds = useFavoriteTeamIds();
  const sidebarStandings =
    conferences && buildSidebarStandings(conferences, favoriteTeamIds);
  const { sidebar } = strings.home;

  if (!sidebarStandings) {
    return (
      <p
        role="alert"
        className={`text-sm text-secondary ${PANEL_SURFACE_CLASS_NAME}`}
      >
        {sidebar.standingsError}
      </p>
    );
  }

  return (
    <section
      aria-labelledby={HEADING_ID}
      className={`flex flex-col gap-3 ${PANEL_SURFACE_CLASS_NAME}`}
    >
      <div className="flex items-center justify-between">
        <h2 id={HEADING_ID} className={PANEL_HEADING_CLASS_NAME}>
          {sidebar.topFive(sidebarStandings.conferenceAbbreviation)}
        </h2>
        <Link
          href="/standings"
          aria-label={sidebar.allStandingsLabel}
          className={`text-xs font-bold text-link transition-colors hover:text-accent ${FOCUS_RING_CLASS_NAME}`}
        >
          {sidebar.allStandings}
        </Link>
      </div>
      <ol className="flex flex-col">
        {sidebarStandings.rows.map((row) => (
          <StandingsPanelRow key={row.teamId} row={row} />
        ))}
      </ol>
    </section>
  );
}
