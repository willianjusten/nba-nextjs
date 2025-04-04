import { NextResponse } from "next/server";

export const revalidate = 86400; // Cache for 24 hours

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } },
) {
  // Add logging for request timestamp
  const requestTimestamp = new Date().toISOString();

  try {
    const gameId = params.gameId;

    const gameRes = await fetch(`${process.env.API_DOMAIN}/api/game/${gameId}`);

    if (!gameRes.ok) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const gameData = await gameRes.json();

    // Extract team names for search
    const homeTeam = gameData.game?.homeTeam.teamName;
    const awayTeam = gameData.game?.awayTeam.teamName;
    const homeScore = gameData.game?.homeTeam.score;
    const awayScore = gameData.game?.awayTeam.score;
    const publishedAfter = gameData.game?.gameTimeUTC;
    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: "Game data incomplete" },
        { status: 400 },
      );
    }

    // Create search query based on actual game data
    const videoTitle = `Game recap: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`;

    const apiKey = process.env.YOUTUBE_API_KEY;

    // NBA official channel ID (https://www.youtube.com/@motionstation4342)
    const channelId = "UCLd4dSmXdrJykO_hgOzbfPw";

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      videoTitle,
    )}&channelId=${channelId}&type=video&maxResults=1&order=relevance&publishedAfter=${publishedAfter}&regionCode=BR&key=${apiKey}`;

    // Track YouTube API call
    const youtubeApiStartTime = Date.now();
    console.log(
      `[${new Date().toISOString()}] Fetching from YouTube API for ${homeTeam} vs ${awayTeam}`,
    );

    // Create AbortController for timing verification
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(apiUrl, {
        cache: "force-cache",
        next: { tags: [`youtube-game-${params.gameId}`] },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const youtubeApiEndTime = Date.now();
      const responseTime = youtubeApiEndTime - youtubeApiStartTime;

      // If response time is very short, it likely came from cache
      const cacheStatus =
        responseTime < 300 ? "LIKELY-CACHE-HIT" : "LIKELY-CACHE-MISS";
      console.log(
        `[${new Date().toISOString()}] YouTube API response received in ${responseTime}ms (${cacheStatus})`,
      );

      const data = await response.json();

      if (!response.ok || !data.items || data.items.length === 0) {
        return NextResponse.json(
          { error: "YouTube API error", details: data.error },
          { status: response.status },
        );
      }

      const video = data.items[0];

      // Add cache information to headers and response
      const headers = new Headers();
      headers.set("X-Cache-Status", cacheStatus);
      headers.set("X-Request-Time", requestTimestamp);
      headers.set("X-Response-Time", new Date().toISOString());
      headers.set("X-Cache-TTL", `${revalidate}s`);

      return NextResponse.json(
        {
          videoId: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          publishedAt: video.snippet.publishedAt,
          _cacheInfo: {
            requestTime: requestTimestamp,
            responseTime: responseTime,
            cacheStatus: cacheStatus,
            gameId: gameId,
          },
        },
        { headers },
      );
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        console.error("YouTube API request timed out");
        return NextResponse.json(
          { error: "YouTube API timeout" },
          { status: 504 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
