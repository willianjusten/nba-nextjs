import { PlayoffRound } from "@/app/api/types";
import { TEAM_ID } from "@/app/constants";

const WinnerIndicator = ({ conference }: { conference: string }) => {
  const transform =
    conference === "East" ? "translate(0, 0)" : "translate(176, 0)";
  return (
    <rect
      height="40"
      width="4"
      transform={transform}
      className="fill-[#1c7ad3]"
    />
  );
};

interface TeamInfo {
  seedId: number;
  seedName?: string;
  seedRank: number;
  seriesWinner: number;
  seriesConference: string;
  seriesWins: number;
  hasTeam: boolean;
}

const TeamRow = ({
  seedId,
  seedName,
  seedRank,
  seriesWinner,
  seriesConference,
  seriesWins,
  hasTeam,
}: TeamInfo) => {
  const teamName =
    seedName || (TEAM_ID as Record<string, string>)[seedId] || "TBD";
  const teamLogo = `https://cdn.nba.com/logos/nba/${seedId}/primary/L/logo.svg`;
  const fallbackLogo = "https://cdn.nba.com/logos/nba/fallback.svg";
  const isWinner = seriesWinner !== 0 && seriesWinner === seedId;

  return (
    <g
      className={`text-xs ${seriesWinner === 0 ? "opacity-100" : !isWinner && "opacity-50"}`}
    >
      {isWinner && <WinnerIndicator conference={seriesConference} />}
      <text
        transform="translate(8, 0)"
        dy="24"
        className="fill-white text-center font-normal"
      >
        {seedRank !== 0 ? seedRank : ""}
      </text>
      <image
        transform="translate(20, 8)"
        width="24"
        height="24"
        xlinkHref={seedId ? teamLogo : fallbackLogo}
      />
      <text
        transform="translate(48, 0)"
        dy="24"
        className="fill-white text-center text-sm font-bold"
      >
        {teamName}
      </text>
      <text
        transform="translate(160, 0)"
        dy="24"
        className="fill-white text-center text-sm font-bold"
      >
        {hasTeam ? seriesWins : ""}
      </text>
    </g>
  );
};

function Card({ data }: { data: PlayoffRound }) {
  const hasTeam = data.highSeedId !== 0 || data.lowSeedId !== 0;

  return (
    <svg
      viewBox="0 0 180 134"
      height="134"
      width="180"
      className="block align-middle"
    >
      <g transform="translate(0, 32)">
        <rect height="40" width="180" className="fill-[#70738529]" />
        <TeamRow
          seedId={data.highSeedId}
          seedName={data.highSeedName}
          seedRank={data.highSeedRank}
          seriesWinner={data.seriesWinner}
          seriesWins={data.highSeedSeriesWins}
          seriesConference={data.seriesConference}
          hasTeam={hasTeam}
        />
      </g>
      <g transform="translate(0, 73)">
        <rect height="40" width="180" className="fill-[#70738529]" />
        <TeamRow
          seedId={data.lowSeedId}
          seedName={data.lowSeedName}
          seedRank={data.lowSeedRank}
          seriesWinner={data.seriesWinner}
          seriesWins={data.lowSeedSeriesWins}
          seriesConference={data.seriesConference}
          hasTeam={hasTeam}
        />
      </g>
      {data.seriesWinner && (
        <g transform="translate(0, 114)">
          <rect height="20" width="180" className="fill-[#70738529]" />
          <text dy="13" dx="4" className="fill-white text-center text-[12px]">
            <tspan className="font-bold">{data.seriesText}</tspan>
          </text>
        </g>
      )}
    </svg>
  );
}

export default Card;
