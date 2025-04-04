"use client";

import useSWR from "swr";
import {
  BackButton,
  GameCard,
  GameSummary,
  PlayersStats,
  TeamStats,
} from "@/app/components";
import GameVideo from "@/app/components/GameVideo";
import { useTitle } from "@/app/hooks/use-title";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

function GameDetails({ id }: { id: string }) {
  const { data } = useSWR(`/api/game/${id}`, fetcher, {
    refreshInterval: 20000,
  });

  const homeTeam = data?.game?.homeTeam;
  const awayTeam = data?.game?.awayTeam;

  const gameScore = `${awayTeam?.teamName} ${awayTeam?.score} x ${homeTeam?.score} ${homeTeam?.teamName}`;

  const title = `${data?.game ? gameScore : "Game Details"} | NBA Next.JS`;

  useTitle(title);

  if (data?.notStarted) {
    return (
      <>
        <BackButton />
        <h1>Game has not started</h1>
      </>
    );
  }

  return (
    <>
      <BackButton />

      <div className="flex max-w-[1280px] flex-col md:flex-row md:gap-8">
        <div className="flex-1">
          <div className="py-5 md:max-w-sm">
            <GameCard {...data.game} details={false} />
          </div>
          <GameSummary game={data.game} />
        </div>

        {/* Show video only if game is over */}
        {data.game.gameStatus === 3 && (
          <div className="md:w-[400px] md:flex-shrink-0 lg:w-[550px]">
            <GameVideo gameId={id} />
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto md:gap-12">
        <PlayersStats team={data.game.homeTeam} />
        <PlayersStats team={data.game.awayTeam} />

        <TeamStats game={data.game} />
      </div>
    </>
  );
}

export default GameDetails;
