"use client";

import { useState } from "react";
import { OutlineButton, StandingTable } from "@/app/components";
import { Conference } from "@/app/helpers";

import { EAST_CONFERENCE, WEST_CONFERENCE } from "@/app/constants";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type SwitchConferenceProps = {
  east: Conference;
  west: Conference;
};

function SwitchConference({ east, west }: SwitchConferenceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialConference = searchParams.get("conference");
  const [conference, setConference] = useState(
    initialConference || EAST_CONFERENCE,
  );
  const isEast = conference === EAST_CONFERENCE;
  const isWest = conference === WEST_CONFERENCE;

  const updateConference = (conference: string) => {
    router.push(`${pathname}?conference=${conference}`);
    setConference(conference);
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
