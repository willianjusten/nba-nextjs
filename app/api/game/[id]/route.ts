import { API } from "@/app/constants";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Fetch game data
    const res = await fetch(
      `${API.DETAILS_URL}/boxscore/boxscore_${params.id}.json`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return Response.json({
        notStarted: true,
      });
    }

    const gameData = await res.json();

    // Check if include_video parameter is present in the request URL
    const url = new URL(request.url);
    const includeVideo = url.searchParams.get("include_video") === "true";

    // If video is not requested, return only game data
    if (!includeVideo) {
      return Response.json(gameData);
    }

    // Extract team names for YouTube search
    const homeTeam = gameData.game?.homeTeam.teamName;
    const awayTeam = gameData.game?.awayTeam.teamName;
    const homeScore = gameData.game?.homeTeam.score;
    const awayScore = gameData.game?.awayTeam.score;
    const publishedAfter = gameData.game?.gameTimeUTC;

    if (!homeTeam || !awayTeam) {
      return Response.json({
        ...gameData,
        video: { error: "Game data incomplete for video search" },
      });
    }

    // Create search query based on actual game data
    const videoTitle = `Game recap: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`;

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = "UCLd4dSmXdrJykO_hgOzbfPw"; // NBA official channel

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      videoTitle,
    )}&channelId=${channelId}&publishedAfter=${publishedAfter}&type=video&maxResults=1&order=relevance&regionCode=BR&key=${apiKey}`;

    // YouTube API call with caching
    try {
      const response = await fetch(apiUrl, {
        cache: "force-cache",
        next: { tags: [`youtube-game-${params.id}`] },
      });

      if (!response.ok) {
        // Return game data with video error
        return Response.json({
          ...gameData,
          video: { error: "YouTube API error" },
        });
      }

      const videoData = await response.json();

      if (!videoData.items || videoData.items.length === 0) {
        return Response.json({
          ...gameData,
          video: { error: "No video found" },
        });
      }

      const video = videoData.items[0];

      // Return combined data
      return Response.json({
        ...gameData,
        video: {
          videoId: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.high.url,
          publishedAt: video.snippet.publishedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching video:", error);
      // Return game data even if video fetch fails
      return Response.json({
        ...gameData,
        video: { error: "Error fetching video" },
      });
    }
  } catch (error) {
    console.error("Error in combined game/video endpoint:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
