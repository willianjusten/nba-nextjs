"use client";

import useSWRImmutable from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type VideoData = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
};

export default function GameVideo({ gameId }: { gameId: string }) {
  const { data, error } = useSWRImmutable<{ video: VideoData }>(
    `/api/game/${gameId}?include_video=true`,
    fetcher,
  );

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
          className="absolute left-0 top-0 h-full w-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
