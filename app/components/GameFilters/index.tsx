import type { GameFilter, GameFilterOption } from "@/app/lib/home/home-view";
import { strings } from "@/app/lib/strings";

const FOCUS_RING_CLASS_NAME =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type GameFiltersProps = {
  filters: GameFilterOption[];
  // Shown at the end of the row on mobile only, as the mobile artboard draws it.
  countLabel: string | null;
  onSelect: (filter: GameFilter) => void;
};

export default function GameFilters({
  filters,
  countLabel,
  onSelect,
}: GameFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="sr-only font-display text-[22px] tracking-[0.14em] text-muted uppercase md:not-sr-only md:mr-auto">
        {strings.gameFilters.heading}
      </h2>
      <div
        role="group"
        aria-label={strings.gameFilters.groupLabel}
        className="flex flex-wrap gap-2"
      >
        {filters.map((option) => (
          <FilterPill
            key={option.filter}
            option={option}
            onClick={() => onSelect(option.filter)}
          />
        ))}
      </div>
      {countLabel && (
        <span className="ml-auto text-xs text-muted md:hidden">
          {countLabel}
        </span>
      )}
    </div>
  );
}

type FilterPillProps = {
  option: GameFilterOption;
  onClick: () => void;
};

function FilterPill({ option, onClick }: FilterPillProps) {
  const toneClassName = option.isSelected
    ? "border-accent bg-accent text-on-accent"
    : "border-white/16 text-secondary hover:bg-white/8";

  return (
    <button
      type="button"
      aria-pressed={option.isSelected}
      onClick={onClick}
      className={`min-h-9 cursor-pointer rounded-full border px-3.5 text-xs font-bold tracking-[0.04em] transition-colors ${FOCUS_RING_CLASS_NAME} ${toneClassName}`}
    >
      {option.label}
    </button>
  );
}
