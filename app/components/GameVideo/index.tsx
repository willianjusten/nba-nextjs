"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";

const fetcher = async (gameId: string) => {
  const res = await fetch(`/api/game/${gameId}?include_video=true`);
  return res.json();
};

type VideoData = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
};

export default function GameVideo({ gameId }: { gameId: string }) {
  const { data, error } = useQuery<{ video: VideoData }>({
    queryKey: ["game-video", gameId],
    queryFn: () => fetcher(gameId),
    staleTime: Infinity,
  });

  if (error || !data?.video?.videoId) {
    return null;
  }

  return (
    <div className="w-full md:mt-0">
      <h2 className="mb-4 text-xl font-bold">Game Highlights</h2>
      <div className="relative h-0 overflow-hidden pb-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${data.video.videoId}`}
          title={data.video.title}
          className="absolute top-0 left-0 h-full w-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
