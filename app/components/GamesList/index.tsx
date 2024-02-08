import Link from "next/link";
import { GameCard } from "@/app/components";
import { ParsedGames } from "@/app/helpers";

type GamesListProps = {
  games?: ParsedGames;
};

function GamesList({ games }: GamesListProps) {
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
