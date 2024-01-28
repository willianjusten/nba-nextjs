"use client";

import useSWR from "swr";

const fetcher = (...args: [RequestInfo, RequestInit]) =>
  fetch(...args).then((res) => res.json());

export default function Games() {
  const today = new Date().toISOString().split("T")[0]; // 2021-01-01

  const { data, error } = useSWR(`/api/games/${today}`, fetcher, {
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
