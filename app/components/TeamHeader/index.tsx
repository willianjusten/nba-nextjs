import type { TeamDetail } from "@/app/lib/domain/team";
import { resizedLogoUrl } from "@/app/lib/espn";
import { strings } from "@/app/lib/strings";

const LOGO_DISPLAY_SIZE = 96;
// Requested at twice the display size so logos stay sharp on high-density screens.
const LOGO_REQUEST_SIZE = LOGO_DISPLAY_SIZE * 2;

export default function TeamHeader({ team }: { team: TeamDetail }) {
  return (
    <header className="flex items-center gap-4">
      <img
        src={resizedLogoUrl(team.logoUrl, LOGO_REQUEST_SIZE)}
        alt=""
        width={LOGO_DISPLAY_SIZE}
        height={LOGO_DISPLAY_SIZE}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{team.displayName}</h1>
        {team.record && (
          <p className="text-slate-300">{strings.team.record(team.record)}</p>
        )}
        {team.standingSummary && (
          <p className="text-sm text-slate-400">{team.standingSummary}</p>
        )}
      </div>
    </header>
  );
}
