import cn from "classnames";

import { TeamInfo, Time } from "@/components";
import { GAME_STATUS, AWAY_TEAM, HOME_TEAM } from "@/constants";
import { getWinner } from "@/helpers/getWinner";

//TODO: Duplicate type definition, should be in a shared file
type GameTeam = {
  teamId: number;
  teamName: string;
  score: number;
  wins?: number;
  losses?: number;
};

type GameCardProps = {
  gameId: string;
  awayTeam: GameTeam;
  homeTeam: GameTeam;
  gameStatus: number;
  gameStatusText: string;
  gameTimeUTC: string;
  period: string;
  details?: boolean;
  interactive?: boolean;
};

function GameCard({
  gameId,
  awayTeam,
  homeTeam,
  gameStatus,
  gameStatusText,
  gameTimeUTC,
  period,
  details = true,
  interactive = true,
}: GameCardProps) {
  const winner = getWinner(awayTeam, homeTeam);

  return (
    <article
      data-game-id={gameId}
      className={cn(
        "border-main bg-glass firefox:bg-slate-750 flex h-full rounded-lg border text-white backdrop-blur-lg duration-300",
        {
          "hover:cursor-pointer hover:bg-slate-700": interactive,
        },
      )}
    >
      <div className="flex w-full flex-col justify-between">
        <div className="flex p-6">
          <TeamInfo team={awayTeam} />

          <div className="mt-3 flex flex-1">
            <p
              className={cn("w-1/3 text-left text-2xl font-bold", {
                "opacity-50":
                  winner !== AWAY_TEAM && gameStatus === GAME_STATUS.ENDED,
              })}
            >
              {!!period && awayTeam.score}
            </p>

            <p className="flex-1 whitespace-nowrap px-3 pt-1.5 text-center text-sm uppercase">
              {gameStatusText.includes("ET") ||
              gameStatusText.includes("PT") ? (
                <Time time={gameTimeUTC} />
              ) : (
                gameStatusText
              )}

              {gameStatus == GAME_STATUS.IN_PROGRESS && (
                <span className="mx-auto block pt-2 text-xs tracking-widest">
                  <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-red-700"></span>
                  Live
                </span>
              )}
            </p>

            <p
              className={cn("w-1/3 text-right text-2xl font-bold", {
                "opacity-50":
                  winner !== HOME_TEAM && gameStatus === GAME_STATUS.ENDED,
              })}
            >
              {!!period && homeTeam.score}
            </p>
          </div>

          <TeamInfo team={homeTeam} />
        </div>

        {details && (
          <footer className="border-main border-t py-2 text-center text-sm">
            View details
          </footer>
        )}
      </div>
    </article>
  );
}

export default GameCard;
