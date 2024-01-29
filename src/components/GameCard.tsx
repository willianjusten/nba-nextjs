import cn from "classnames";

import { TeamInfo } from "@/components/TeamInfo";
import { GAME_STATUS } from "@/constants";
import { formatClock } from "@/helpers/date";
import { getWinner } from "@/helpers/getWinner";

export function GameCard({
  awayTeam,
  homeTeam,
  gameStatus,
  gameStatusText,
  gameTimeUTC,
  period,
  details = true,
  interactive = true,
}) {
  const winner = getWinner(awayTeam, homeTeam);

  return (
    <article
      className={cn(
        "text-white flex h-full rounded-lg border border-main bg-glass backdrop-blur-lg duration-300 firefox:bg-slate-750",
        {
          "hover:cursor-pointer hover:bg-slate-700": interactive,
        }
      )}>
      <div className="flex w-full flex-col justify-between">
        <div className="flex p-6">
          <TeamInfo team={awayTeam} />

          <div className="mt-3 flex flex-1">
            <p
              className={cn("w-1/3 text-left text-2xl font-bold", {
                "opacity-50":
                  winner !== "awayTeam" && gameStatus === GAME_STATUS.ENDED,
              })}>
              {!!period && awayTeam.score}
            </p>

            <p className="text-sm flex-1 whitespace-nowrap px-3 pt-1.5 text-center uppercase">
              {formatClock(gameStatusText, gameTimeUTC)}

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
                  winner !== "homeTeam" && gameStatus === GAME_STATUS.ENDED,
              })}>
              {!!period && homeTeam.score}
            </p>
          </div>

          <TeamInfo team={homeTeam} />
        </div>

        {details && (
          <footer className="border-t border-main py-2 text-center text-sm">
            View details
          </footer>
        )}
      </div>
    </article>
  );
}
