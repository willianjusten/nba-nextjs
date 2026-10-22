import Link from "next/link";
import type { ConferenceStandings as ConferenceStandingsData } from "@/app/lib/domain/standings";
import { resizedLogoUrl } from "@/app/lib/espn";
import { strings } from "@/app/lib/strings";

const LOGO_DISPLAY_SIZE = 24;
// Requested at twice the display size so logos stay sharp on high-density screens.
const LOGO_REQUEST_SIZE = LOGO_DISPLAY_SIZE * 2;

// Win percentage as standings tables print it: ".750", or "1.000" for an unbeaten team.
function formatWinPercent(winPercent: number) {
  return winPercent.toFixed(3).replace(/^0/, "");
}

function formatGamesBehind(gamesBehind: number) {
  return gamesBehind === 0
    ? strings.standings.leaderGamesBehind
    : String(gamesBehind);
}

export default function ConferenceStandings({
  conference,
}: {
  conference: ConferenceStandingsData;
}) {
  const { columns } = strings.standings;
  const headingId = `standings-${conference.id}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="text-xl font-bold">
        {conference.name}
      </h2>
      <div className="overflow-x-auto rounded-lg bg-glass">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-2">{columns.seed}</th>
              <th className="px-3 py-2">{columns.team}</th>
              <th className="px-3 py-2">{columns.wins}</th>
              <th className="px-3 py-2">{columns.losses}</th>
              <th className="px-3 py-2">{columns.winPercent}</th>
              <th className="px-3 py-2">{columns.gamesBehind}</th>
              <th className="px-3 py-2">{columns.home}</th>
              <th className="px-3 py-2">{columns.road}</th>
              <th className="px-3 py-2">{columns.lastTen}</th>
              <th className="px-3 py-2">{columns.streak}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {conference.rows.map((row) => (
              <tr key={row.team.id} className="border-t border-white/10">
                <td className="px-3 py-2">{row.seed}</td>
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    <img
                      src={resizedLogoUrl(row.team.logoUrl, LOGO_REQUEST_SIZE)}
                      alt=""
                      width={LOGO_DISPLAY_SIZE}
                      height={LOGO_DISPLAY_SIZE}
                      loading="lazy"
                    />
                    <Link
                      href={`/teams/${row.team.slug}`}
                      className="font-medium whitespace-nowrap hover:underline"
                    >
                      {row.team.displayName}
                    </Link>
                  </span>
                </td>
                <td className="px-3 py-2">{row.wins}</td>
                <td className="px-3 py-2">{row.losses}</td>
                <td className="px-3 py-2">
                  {formatWinPercent(row.winPercent)}
                </td>
                <td className="px-3 py-2">
                  {formatGamesBehind(row.gamesBehind)}
                </td>
                <td className="px-3 py-2">{row.homeRecord}</td>
                <td className="px-3 py-2">{row.roadRecord}</td>
                <td className="px-3 py-2">{row.lastTenRecord}</td>
                <td className="px-3 py-2">
                  {row.streak ?? strings.standings.noStreak}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
