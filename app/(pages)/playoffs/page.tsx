import { PlayoffsTable } from "@/app/components";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Playoffs | NBA Next.js",
  description: "See the current Playoffs for NBA",
};

async function Playoffs() {
  return (
    <Suspense>
      <PlayoffsTable />
    </Suspense>
  );
}

export default Playoffs;
