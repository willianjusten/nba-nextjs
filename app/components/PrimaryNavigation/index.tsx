import NavigationLinks from "@/app/components/PrimaryNavigation/NavigationLinks";
import { scoreboardQueryOptions } from "@/app/lib/queries/scoreboard";
import { getServerQueryClient } from "@/app/lib/query/server";
import {
  isPostseason,
  isPostseasonForcedByEnv,
} from "@/app/lib/season/postseason";
import { currentNbaDate } from "@/app/lib/time/nba-date";

export default async function PrimaryNavigation() {
  return <NavigationLinks showPlayoffs={await shouldShowPlayoffs()} />;
}

export function PrimaryNavigationFallback() {
  return <NavigationLinks showPlayoffs={false} />;
}

async function shouldShowPlayoffs() {
  const forcedOn = isPostseasonForcedByEnv();

  try {
    // Shares the request-scoped client so the home page prefetch and this lookup make a single ESPN request.
    const { games } = await getServerQueryClient().fetchQuery(
      scoreboardQueryOptions(currentNbaDate()),
    );
    return isPostseason(games, forcedOn);
  } catch (error) {
    // The tab is a convenience, so a scoreboard failure hides it instead of breaking every page.
    console.error("Failed to load the scoreboard for the playoffs tab", error);
    return forcedOn;
  }
}
