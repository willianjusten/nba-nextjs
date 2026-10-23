import type { TeamDetail } from "@/app/lib/domain/team";
import TeamLogo from "@/app/components/TeamLogo";
import { strings } from "@/app/lib/strings";

const LOGO_DISPLAY_SIZE = 96;

export default function TeamHeader({ team }: { team: TeamDetail }) {
  return (
    <header className="flex items-center gap-4">
      <TeamLogo logoUrl={team.logoUrl} size={LOGO_DISPLAY_SIZE} />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-5xl leading-none tracking-[0.01em]">
          {team.displayName}
        </h1>
        {team.record && (
          <p className="text-secondary">{strings.team.record(team.record)}</p>
        )}
        {team.standingSummary && (
          <p className="text-sm text-muted">{team.standingSummary}</p>
        )}
      </div>
    </header>
  );
}
