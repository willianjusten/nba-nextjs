// @vitest-environment node
import { QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { fetchScoreboard } from "@/app/lib/espn";
import liveDay from "@/app/lib/espn/__fixtures__/scoreboard-live-day-simulated.json";
import { makeQueryClient } from "@/app/lib/query/make-query-client";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import DayScoreboard from ".";

const nbaDate = "2026-10-22" as NbaDate;

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DayScoreboard on the server", () => {
  it("renders prefetched live games without browser globals", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(liveDay))),
    );
    const queryClient = makeQueryClient();
    queryClient.setQueryData(
      scoreboardQueryOptions(nbaDate).queryKey,
      await fetchScoreboard(nbaDate),
    );

    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <DayScoreboard initialDate={nbaDate} today={nbaDate} />
      </QueryClientProvider>,
    );

    expect(html).toContain("Philadelphia 76ers");
  });
});
