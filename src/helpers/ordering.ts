import { PRIORITY } from "@/constants";

export const orderByStatus = (a, b) => {
  return PRIORITY[a.gameStatus] - PRIORITY[b.gameStatus];
};
