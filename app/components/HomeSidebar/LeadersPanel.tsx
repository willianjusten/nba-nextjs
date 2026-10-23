import type { LeaderCategory } from "@/app/lib/domain/leaders";
import { resizedImageUrl } from "@/app/lib/espn";
import {
  buildSidebarLeaders,
  type SidebarLeaderCategory,
} from "@/app/lib/home/sidebar";
import { strings } from "@/app/lib/strings";
import { PANEL_HEADING_CLASS_NAME } from "./styles";

// ESPN headshots are 1040x760, so this keeps their aspect ratio.
const HEADSHOT_DISPLAY_WIDTH = 56;
const HEADSHOT_DISPLAY_HEIGHT = 41;
// Requested at twice the display size so headshots stay sharp on high-density screens.
const HEADSHOT_REQUEST_SCALE = 2;
const HEADING_ID = "sidebar-leaders";

const HEADSHOT_CLASS_NAME = "shrink-0 rounded-[10px] bg-white/6 object-cover";

function CategoryMessage({ category }: { category: SidebarLeaderCategory }) {
  return category.status === "error" ? (
    <p role="alert" className="text-sm text-muted">
      {strings.leaders.categoryError}
    </p>
  ) : (
    <p className="text-sm text-muted">{strings.leaders.empty}</p>
  );
}

function LeaderRow({ category }: { category: SidebarLeaderCategory }) {
  const title = strings.home.sidebar.categories[category.stat];
  const headingId = `${HEADING_ID}-${category.stat}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex items-center gap-3 border-t border-white/7 pt-3"
    >
      {category.status === "ready" && category.leader.athlete.headshotUrl ? (
        <img
          src={resizedImageUrl(
            category.leader.athlete.headshotUrl,
            HEADSHOT_DISPLAY_WIDTH * HEADSHOT_REQUEST_SCALE,
            HEADSHOT_DISPLAY_HEIGHT * HEADSHOT_REQUEST_SCALE,
          )}
          alt={category.leader.athlete.displayName}
          width={HEADSHOT_DISPLAY_WIDTH}
          height={HEADSHOT_DISPLAY_HEIGHT}
          loading="lazy"
          className={HEADSHOT_CLASS_NAME}
        />
      ) : (
        <span
          aria-hidden="true"
          className={HEADSHOT_CLASS_NAME}
          style={{
            width: HEADSHOT_DISPLAY_WIDTH,
            height: HEADSHOT_DISPLAY_HEIGHT,
          }}
        />
      )}
      <div className="flex min-w-0 grow flex-col gap-0.5">
        <h3
          id={headingId}
          className="text-[10px] tracking-[0.16em] text-muted uppercase"
        >
          {title}
        </h3>
        {category.status === "ready" ? (
          <>
            <span className="text-sm font-bold">
              {category.leader.athlete.displayName}
            </span>
            {category.runnersUp.length > 0 && (
              <ol className="flex flex-wrap gap-x-1 text-[11px] text-muted">
                {category.runnersUp.map((runnerUp, index) => (
                  <li key={runnerUp.rank}>
                    {index > 0 && <span aria-hidden="true">· </span>}
                    {strings.home.sidebar.runnerUp(runnerUp)}
                  </li>
                ))}
              </ol>
            )}
          </>
        ) : (
          <CategoryMessage category={category} />
        )}
      </div>
      {category.status === "ready" && (
        <span className="font-display text-[28px] leading-none text-accent-soft">
          {category.leader.displayValue}
        </span>
      )}
    </section>
  );
}

export default function LeadersPanel({
  // null when the leaders could not be loaded.
  categories,
}: {
  categories: LeaderCategory[] | null;
}) {
  return (
    <section
      aria-labelledby={HEADING_ID}
      className="flex flex-col gap-3.5 card p-4.5"
    >
      <h2 id={HEADING_ID} className={PANEL_HEADING_CLASS_NAME}>
        {strings.home.sidebar.leadersTitle}
      </h2>
      {categories ? (
        buildSidebarLeaders(categories).map((category) => (
          <LeaderRow key={category.stat} category={category} />
        ))
      ) : (
        <p role="alert" className="text-sm text-secondary">
          {strings.leaders.error}
        </p>
      )}
    </section>
  );
}
