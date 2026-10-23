"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { FOCUS_RING_CLASS_NAME } from "@/app/components/DatePicker/DatePickerTrigger";
import TeamLogo from "@/app/components/TeamLogo";
import {
  favoritesStore,
  useAreFavoritesPersisted,
  useFavoriteTeamIds,
} from "@/app/lib/favorites/use-favorite-team-ids";
import {
  buildTeamPicker,
  type TeamPickerOption,
} from "@/app/lib/favorites/my-teams";
import { teamsQueryOptions } from "@/app/lib/queries/teams";
import { strings } from "@/app/lib/strings";
import TeamPickerTrigger from "./TeamPickerTrigger";

const PICKER_LOGO_SIZE = 32;

// Mounted on the first click of the trigger, so it starts open; it stays open while teams are toggled.
export default function TeamPickerPopover() {
  const [isOpen, setIsOpen] = useState(true);
  const favoriteTeamIds = useFavoriteTeamIds();
  const areFavoritesPersisted = useAreFavoritesPersisted();
  const { data: teams, isError } = useQuery(teamsQueryOptions());

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <TeamPickerTrigger />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          aria-label={strings.myTeams.pickerTitle}
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 flex w-[min(22.5rem,calc(100vw-2rem))] flex-col gap-3 card border-white/10 bg-white/4.5 p-3 text-foreground shadow-[0_24px_48px_rgb(0_0_0/0.45)] backdrop-blur-xl md:p-4"
        >
          <p className="font-display text-2xl leading-none tracking-[0.04em]">
            {strings.myTeams.pickerTitle}
          </p>
          {!areFavoritesPersisted && (
            <p role="status" className="text-xs text-warning-soft">
              {strings.myTeams.unpersisted}
            </p>
          )}
          {teams ? (
            <div className="grid grid-cols-5 gap-1.5">
              {buildTeamPicker(teams, favoriteTeamIds).map((option) => (
                <TeamOptionButton
                  key={option.teamId}
                  option={option}
                  onClick={() => favoritesStore().toggle(option.teamId)}
                />
              ))}
            </div>
          ) : (
            <p role="status" className="text-sm text-muted">
              {isError ? strings.myTeams.error : strings.myTeams.loading}
            </p>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function TeamOptionButton({
  option,
  onClick,
}: {
  option: TeamPickerOption;
  onClick: () => void;
}) {
  const toneClassName = option.isFavorite
    ? "border-favorite/60 bg-favorite/14"
    : "border-transparent hover:bg-white/8";

  return (
    <button
      type="button"
      aria-label={option.label}
      aria-pressed={option.isFavorite}
      title={option.displayName}
      onClick={onClick}
      className={`flex aspect-square min-h-11 cursor-pointer items-center justify-center rounded-full border transition-colors ${FOCUS_RING_CLASS_NAME} ${toneClassName}`}
    >
      <TeamLogo logoUrl={option.logoUrl} size={PICKER_LOGO_SIZE} />
    </button>
  );
}
