import Link from "next/link";
import { GameCard } from "@/app/components";
import { ParsedGames } from "@/app/helpers";

type GamesListProps = {
  games?: ParsedGames["games"];
};

function GamesList({ games }: GamesListProps) {
  if (!games?.length) {
    return (
      <p className="flex flex-grow items-center justify-center text-center text-2xl">
        No games today :(
      </p>
    );
  }

  return (
    <main className="grid grid-cols-auto-fill gap-5">
      {games?.map((game) => (
        <Link key={game.gameId} href={`/game/${game.gameId}`}>
          <GameCard {...game} />
        </Link>
      ))}
    </main>
  );
}

export default GamesList;
