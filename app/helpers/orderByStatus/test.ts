import { GAME_STATUS } from "@/app/constants";
import { orderByStatus } from ".";

describe("orderByStatus", () => {
  it("should order by IN_PROGRESS/NOT_STARTED/ENDED", () => {
    const games = [
      { gameStatus: GAME_STATUS.ENDED },
      { gameStatus: GAME_STATUS.IN_PROGRESS },
      { gameStatus: GAME_STATUS.NOT_STARTED },
      { gameStatus: GAME_STATUS.IN_PROGRESS },
      { gameStatus: GAME_STATUS.NOT_STARTED },
    ];

    const result = [
      { gameStatus: GAME_STATUS.IN_PROGRESS },
      { gameStatus: GAME_STATUS.IN_PROGRESS },
      { gameStatus: GAME_STATUS.NOT_STARTED },
      { gameStatus: GAME_STATUS.NOT_STARTED },
      { gameStatus: GAME_STATUS.ENDED },
    ];

    expect(games.sort(orderByStatus)).toEqual(result);
  });
});
