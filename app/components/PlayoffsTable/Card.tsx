import { TEAM_ID } from "@/app/constants";

const WinnerIndicator = ({ conference = "east" }: { conference: string }) => {
  const transform =
    conference === "East" ? "translate(0, 0)" : "translate(176, 0)";

  return (
    <rect
      height="40"
      width="4"
      transform={transform}
      className="fill-[#1c7ad3]"
    ></rect>
  );
};

function Card({ data }) {
  const highSeedName = data.highSeedName || TEAM_ID[data.highSeedId] || "TBD";
  const lowSeedName = data.lowSeedName || TEAM_ID[data.lowSeedId] || "TBD";
  const highSeedLogo = `https://cdn.nba.com/logos/nba/${data.highSeedId}/primary/L/logo.svg`;
  const lowSeedLogo = `https://cdn.nba.com/logos/nba/${data.lowSeedId}/primary/L/logo.svg`;
  const fallbackLogo = "https://cdn.nba.com/logos/nba/fallback.svg";
  const highSeedRank = data.highSeedRank !== 0 ? data.highSeedRank : "";
  const lowSeedRank = data.lowSeedRank !== 0 ? data.lowSeedRank : "";
  const highSeedRegSeasonWins = data.highSeedRegSeasonWins || "";
  const highSeedRegSeasonLosses = data.highSeedRegSeasonLosses || "";
  const lowSeedRegSeasonWins = data.lowSeedRegSeasonWins || "";
  const lowSeedRegSeasonLosses = data.lowSeedRegSeasonLosses || "";

  return (
    <svg
      viewBox="0 0 180 134"
      height="134"
      width="180"
      className="block align-middle"
    >
      <g transform="translate(0, 32)">
        <rect height="40" width="180" className="fill-[#70738529]"></rect>
        <g
          className={`text-xs ${
            data.seriesWinner !== 0 &&
            data.seriesWinner !== data.highSeedId &&
            "opacity-50"
          }`}
        >
          {data.seriesWinner !== 0 && data.seriesWinner === data.highSeedId && (
            <WinnerIndicator conference={data.seriesConference} />
          )}
          <text
            transform="translate(8,0)"
            dy="24"
            className=" fill-white text-center font-normal"
          >
            {highSeedRank}
          </text>
          <image
            transform="translate(20, 8)"
            width="24"
            height="24"
            xlinkHref={data.highSeedId ? highSeedLogo : fallbackLogo}
          ></image>
          <text
            transform="translate(48, 0)"
            dy="24"
            className=" fill-white text-center font-bold"
          >
            {highSeedName}
          </text>
          <text
            transform="translate(140, 0)"
            dy="24"
            className="fill-white text-center text-[10px] font-bold"
          >
            {highSeedRegSeasonWins && highSeedRegSeasonLosses
              ? `${highSeedRegSeasonWins}-${highSeedRegSeasonLosses}`
              : ""}
          </text>
        </g>
      </g>
      <g transform="translate(0, 73)">
        <rect height="40" width="180" className="fill-[#70738529]"></rect>
        <g
          className={`text-xs ${
            data.seriesWinner !== 0 &&
            data.seriesWinner !== data.lowSeedId &&
            "opacity-50"
          }`}
        >
          {data.seriesWinner !== 0 && data.seriesWinner === data.lowSeedId && (
            <WinnerIndicator conference={data.seriesConference} />
          )}
          <text
            transform="translate(8, 0)"
            dy="24"
            className=" fill-white text-center"
          >
            {lowSeedRank}
          </text>
          <image
            transform="translate(20, 8)"
            width="24"
            height="24"
            xlinkHref={data.lowSeedId ? lowSeedLogo : fallbackLogo}
          ></image>
          <text
            transform="translate(48, 0)"
            dy="24"
            className="fill-white text-center font-bold"
          >
            {lowSeedName}
          </text>
          <text
            transform="translate(140, 0)"
            dy="24"
            className=" fill-white text-center text-[10px] font-bold"
          >
            {lowSeedRegSeasonWins && lowSeedRegSeasonLosses
              ? `${lowSeedRegSeasonWins}-${lowSeedRegSeasonLosses}`
              : ""}
          </text>
        </g>
      </g>
      {data.seriesWinner && (
        <g transform="translate(0, 114)">
          <rect height="20" width="180" className="fill-[#70738529]"></rect>
          <text dy="13" dx="4" className=" fill-white text-center text-[10px] ">
            <tspan className="font-bold">{data.seriesText}</tspan>
          </text>
        </g>
      )}
    </svg>
  );
}

export default Card;
