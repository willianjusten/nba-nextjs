import { Game } from "@/app/api/types";
import { PRIORITY } from "@/app/constants";

export const orderByStatus = (
  a: Pick<Game, "gameStatus">,
  b: Pick<Game, "gameStatus">,
) => {
  return PRIORITY[a.gameStatus] - PRIORITY[b.gameStatus];
};
