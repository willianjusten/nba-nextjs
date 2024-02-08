import Link from "next/link";
import { GameCard } from "@/components";
import { Game } from "@/app/api/types";
import { parseGames } from "@/helpers/mappers";

type GamesListProps = {
  games?: Game[] | ReturnType<typeof parseGames>;
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
