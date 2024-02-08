import Link from "next/link";
import { GameCard } from "@/components";
import { ParsedGames } from "@/helpers/mappers";

type GamesListProps = {
  games?: ParsedGames;
};

function GamesList({ games }: GamesListProps) {
  return (
    <main className="grid-cols-auto-fill grid gap-5">
      {games?.map((game) => (
        <Link key={game.gameId} href={`/game/${game.gameId}`}>
          <GameCard {...game} />
        </Link>
      ))}
    </main>
  );
}

export default GamesList;
