import { Game } from "@/app/api/types";
import { PRIORITY } from "@/app/constants";

export const orderByStatus = (a: Game, b: Game) => {
  return PRIORITY[a.gameStatus] - PRIORITY[b.gameStatus];
};
