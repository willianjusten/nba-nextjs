"use client";

import { useState } from "react";
import { OutlineButton, StandingTable } from "@/app/components";
import { Conference } from "@/app/helpers";

import { EAST_CONFERENCE, WEST_CONFERENCE } from "@/app/constants";

type SwitchConferenceProps = {
  east: Conference;
  west: Conference;
};

function SwitchConference({ east, west }: SwitchConferenceProps) {
  const [conference, setConference] = useState(EAST_CONFERENCE);
  const isEast = conference === EAST_CONFERENCE;
  const isWest = conference === WEST_CONFERENCE;

  return (
    <>
      <div className="flex gap-4">
        <OutlineButton
          label={"East"}
          active={isEast}
          onClick={() => setConference(EAST_CONFERENCE)}
        />
        <OutlineButton
          label={"West"}
          active={isWest}
          onClick={() => setConference(WEST_CONFERENCE)}
        />
      </div>
      {isEast && <StandingTable label="Eastern Conference" conference={east} />}
      {isWest && <StandingTable label="Western Conference" conference={west} />}
    </>
  );
}

export default SwitchConference;
