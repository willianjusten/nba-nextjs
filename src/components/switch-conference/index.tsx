"use client";

import { useState } from "react";
import { OutlineButton } from "@/components";
import { StandingTable } from "@/components";
import { Conference } from "@/helpers/mappers";

type SwitchConferenceProps = {
  east: Conference;
  west: Conference;
};

export default function SwitchConference({
  east,
  west,
}: SwitchConferenceProps) {
  const [conference, setConference] = useState("east");
  const isEast = conference === "east";
  const isWest = conference === "west";

  return (
    <>
      <div className="flex gap-4">
        <OutlineButton
          label={"East"}
          active={isEast}
          onClick={() => setConference("east")}
        />
        <OutlineButton
          label={"West"}
          active={isWest}
          onClick={() => setConference("west")}
        />
      </div>
      {isEast && <StandingTable label="Eastern Conference" conference={east} />}
      {isWest && <StandingTable label="Western Conference" conference={west} />}
    </>
  );
}
