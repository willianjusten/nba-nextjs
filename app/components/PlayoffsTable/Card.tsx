import { PlayoffRound } from "@/app/api/types";
import { TEAM_ID } from "@/app/constants";
import { GlassRect, SvgText } from "./SVGHelpers";

const SVG_DIMENSIONS = {
  card: { width: 180, height: 134 },
  row: { height: 40, width: 180 },
  indicator: { height: 40, width: 4 },
  image: { width: 24, height: 24 },
};

const WinnerIndicator = ({ conference }: { conference: string }) => {
  const transform =
    conference === "East" ? "translate(0, 0)" : "translate(176, 0)";
  return (
    <rect
      height={SVG_DIMENSIONS.indicator.height}
      width={SVG_DIMENSIONS.indicator.width}
      transform={transform}
      className="fill-blue-500"
    />
  );
};

type TeamInfo = {
  seedId: number;
  seedName?: string;
  seedRank: number;
  seriesWinner: number;
  seriesConference: string;
  seriesWins: number;
  hasTeam: boolean;
};

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
    <>
      <GlassRect
        height={SVG_DIMENSIONS.row.height}
        width={SVG_DIMENSIONS.row.width}
      />
      <g
        className={`text-xs ${seriesWinner === 0 ? "opacity-100" : !isWinner && "opacity-50"}`}
      >
        {isWinner && <WinnerIndicator conference={seriesConference} />}

        <SvgText x={8} y={24} className="font-normal">
          {seedRank !== 0 ? seedRank : ""}
        </SvgText>

        <image
          width={SVG_DIMENSIONS.image.width}
          height={SVG_DIMENSIONS.image.height}
          transform="translate(20, 8)"
          xlinkHref={seedId ? teamLogo : fallbackLogo}
        />

        <SvgText x={48} y={24} className="text-sm font-bold">
          {teamName}
        </SvgText>

        <SvgText x={160} y={24} className="text-sm font-bold">
          {hasTeam ? seriesWins : ""}
        </SvgText>
      </g>
    </>
  );
};

function Card({ data }: { data: PlayoffRound }) {
  const hasTeam = data.highSeedId !== 0 || data.lowSeedId !== 0;

  return (
    <svg
      viewBox={`0 0 ${SVG_DIMENSIONS.card.width} ${SVG_DIMENSIONS.card.height}`}
      height={SVG_DIMENSIONS.card.height}
      width={SVG_DIMENSIONS.card.width}
      className="block align-middle"
    >
      <g transform="translate(0, 32)">
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
          <GlassRect
            height={20}
            width={SVG_DIMENSIONS.row.width}
            className="fill-[#4b566e]"
          />
          <SvgText y={13} x={4} className="text-center text-[12px] font-bold">
            {data.seriesText}
          </SvgText>
        </g>
      )}
    </svg>
  );
}

export default Card;
