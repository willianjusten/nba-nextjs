"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { setConferenceCookie } from "@/app/helpers";
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
  initialConference?: string;
};

function SwitchConference({
  east,
  west,
  initialConference,
}: SwitchConferenceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const conference =
    searchParams.get(CONFERENCE_KEY) ?? initialConference ?? EAST_CONFERENCE;

  const isEast = conference === EAST_CONFERENCE;
  const isWest = conference === WEST_CONFERENCE;

  const updateConference = (next: string) => {
    setConferenceCookie(next);
    router.push(`${pathname}?conference=${next}`);
  };

  return (
    <>
      <div className="flex gap-4">
        <OutlineButton
          label="East"
          active={isEast}
          onClick={() => updateConference(EAST_CONFERENCE)}
        />
        <OutlineButton
          label="West"
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
