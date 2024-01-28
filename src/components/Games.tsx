"use client";

import { getDays } from "@/helpers/date";
import useSWR from "swr";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const { day } = getDays();
  const { data, error } = useSWR(`/api/games/${day}`, fetcher, {
    refreshInterval: 20000,
  });

  if (error) {
    throw error;
  }

  return (
    <main>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
