"use client";

import useSWR from "swr";
import {
  BackButton,
  GameCard,
  GameSummary,
  PlayersStats,
  TeamStats,
} from "@/app/components";
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

      <div className="py-5 md:max-w-sm">
        <GameCard {...data.game} details={false} />
      </div>

      <GameSummary game={data.game} />

      <div className="flex gap-4 overflow-x-auto md:gap-12 ">
        <PlayersStats team={data.game.homeTeam} />
        <PlayersStats team={data.game.awayTeam} />

        <TeamStats game={data.game} />
      </div>
    </>
  );
}

export default GameDetails;
