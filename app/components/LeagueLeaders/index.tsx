import type { LeaderCategory } from "@/app/lib/domain/leaders";
import { resizedImageUrl } from "@/app/lib/espn";
import { strings } from "@/app/lib/strings";

// ESPN headshots are 1040x760, so this keeps their aspect ratio.
const HEADSHOT_DISPLAY_WIDTH = 48;
const HEADSHOT_DISPLAY_HEIGHT = 35;
// Requested at twice the display size so headshots stay sharp on high-density screens.
const HEADSHOT_REQUEST_SCALE = 2;
const HEADING_ID = "league-leaders";

function LeaderCategoryCard({ category }: { category: LeaderCategory }) {
  const { title, unit } = strings.leaders.categories[category.stat];
  const headingId = `leaders-${category.stat}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-2 rounded-lg bg-glass p-4"
    >
      <h3 id={headingId} className="font-bold">
        {title}
      </h3>
      {category.leaders === null ? (
        <p role="alert" className="text-sm text-slate-400">
          {strings.leaders.categoryError}
        </p>
      ) : category.leaders.length === 0 ? (
        <p className="text-sm text-slate-400">{strings.leaders.empty}</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {category.leaders.map(({ athlete, displayValue }) => (
            <li key={athlete.id} className="flex items-center gap-3 text-sm">
              {athlete.headshotUrl ? (
                <img
                  src={resizedImageUrl(
                    athlete.headshotUrl,
                    HEADSHOT_DISPLAY_WIDTH * HEADSHOT_REQUEST_SCALE,
                    HEADSHOT_DISPLAY_HEIGHT * HEADSHOT_REQUEST_SCALE,
                  )}
                  alt={athlete.displayName}
                  width={HEADSHOT_DISPLAY_WIDTH}
                  height={HEADSHOT_DISPLAY_HEIGHT}
                  loading="lazy"
                  className="rounded bg-white/5"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="rounded bg-white/5"
                  style={{
                    width: HEADSHOT_DISPLAY_WIDTH,
                    height: HEADSHOT_DISPLAY_HEIGHT,
                  }}
                />
              )}
              <span className="flex-1 font-medium">{athlete.displayName}</span>
              <span className="tabular-nums">{displayValue}</span>
              <span className="text-xs text-slate-400">{unit}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function LeagueLeaders({
  categories,
}: {
  // null when the leaders could not be loaded.
  categories: LeaderCategory[] | null;
}) {
  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-2">
      <h2 id={HEADING_ID} className="text-xl font-bold">
        {strings.leaders.title}
      </h2>
      {categories ? (
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <LeaderCategoryCard key={category.stat} category={category} />
          ))}
        </div>
      ) : (
        <p role="alert" className="text-slate-300">
          {strings.leaders.error}
        </p>
      )}
    </section>
  );
}
