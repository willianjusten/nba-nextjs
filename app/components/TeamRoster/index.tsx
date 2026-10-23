import type { RosterPlayer } from "@/app/lib/domain/team";
import { strings } from "@/app/lib/strings";

const HEADING_ID = "team-roster";

export default function TeamRoster({ players }: { players: RosterPlayer[] }) {
  const { roster } = strings.team;

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-2">
      <h2 id={HEADING_ID} className="font-display text-2xl tracking-[0.06em]">
        {roster.title}
      </h2>
      <div className="overflow-x-auto card">
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="px-4 py-2">{roster.jersey}</th>
              <th className="px-4 py-2">{roster.player}</th>
              <th className="px-4 py-2">{roster.position}</th>
              <th className="px-4 py-2">{roster.height}</th>
              <th className="px-4 py-2">{roster.weight}</th>
              <th className="px-4 py-2">{roster.age}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-t border-white/10">
                <td className="px-4 py-2 tabular-nums">{player.jersey}</td>
                <td className="px-4 py-2 font-medium">{player.displayName}</td>
                <td className="px-4 py-2">{player.position}</td>
                <td className="px-4 py-2">{player.height}</td>
                <td className="px-4 py-2">{player.weight}</td>
                <td className="px-4 py-2 tabular-nums">{player.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
