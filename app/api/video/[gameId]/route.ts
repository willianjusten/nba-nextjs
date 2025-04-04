import { NextResponse } from "next/server";

// Set a 24-hour revalidation period (in seconds)
export const revalidate = 86400;

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } },
) {
  try {
    const gameId = params.gameId;

    const gameRes = await fetch(
      `${process.env.API_DOMAIN}/api/game/${gameId}`,
      { cache: "force-cache" },
    );

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
    )}&channelId=${channelId}&type=video&maxResults=1&order=relevance&publishedAfter=${publishedAfter}&key=${apiKey}`;

    const response = await fetch(apiUrl, { cache: "force-cache" });
    const data = await response.json();

    console.log("apiUrl", apiUrl);
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "YouTube API error", details: data.error },
        { status: response.status },
      );
    }

    const video = data.items[0];

    return NextResponse.json({
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
