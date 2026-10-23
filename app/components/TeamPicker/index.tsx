"use client";

import { lazy, Suspense, useState } from "react";
import TeamPickerTrigger from "./TeamPickerTrigger";

// The popover and its Radix dependency load on first use, keeping them out of every page's initial bundle.
const loadTeamPickerPopover = () => import("./TeamPickerPopover");
const TeamPickerPopover = lazy(loadTeamPickerPopover);

export default function TeamPicker() {
  const [hasOpened, setHasOpened] = useState(false);
  const plainTrigger = (
    <TeamPickerTrigger
      onClick={() => setHasOpened(true)}
      onPointerEnter={loadTeamPickerPopover}
    />
  );

  if (!hasOpened) return plainTrigger;
  return (
    <Suspense fallback={plainTrigger}>
      <TeamPickerPopover />
    </Suspense>
  );
}
