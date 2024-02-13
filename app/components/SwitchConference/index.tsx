"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import type { Conference } from "@/app/helpers";
import { OutlineButton, StandingTable } from "@/app/components";
import {
  EAST_CONFERENCE,
  WEST_CONFERENCE,
  CONFERENCE_KEY,
} from "@/app/constants";

type SwitchConferenceProps = {
  east: Conference;
  west: Conference;
};

function SwitchConference({ east, west }: SwitchConferenceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function getLocalStorageConference() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(CONFERENCE_KEY);
    }

    return null;
  }

  const initialConference =
    searchParams.get(CONFERENCE_KEY) || getLocalStorageConference();

  const [conference, setConference] = useState(
    initialConference || EAST_CONFERENCE,
  );

  const isEast = conference === EAST_CONFERENCE;
  const isWest = conference === WEST_CONFERENCE;

  const updateConference = (conference: string) => {
    setConference(conference);
    router.push(`${pathname}?conference=${conference}`);
    localStorage.setItem(CONFERENCE_KEY, conference);
  };

  return (
    <>
      <div className="flex gap-4">
        <OutlineButton
          label={"East"}
          active={isEast}
          onClick={() => updateConference(EAST_CONFERENCE)}
        />
        <OutlineButton
          label={"West"}
          active={isWest}
          onClick={() => updateConference(WEST_CONFERENCE)}
        />
      </div>
      {isEast && <StandingTable label="Eastern Conference" conference={east} />}
      {isWest && <StandingTable label="Western Conference" conference={west} />}
    </>
  );
}

export default SwitchConference;
