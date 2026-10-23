import { resizedLogoUrl } from "@/app/lib/espn";

type TeamLogoProps = {
  logoUrl: string | null;
  size: number;
  lazy?: boolean;
};

const SHIELD_OUTLINE_PATH =
  "M12 1.5 21 4.5v6.8c0 5.6-3.8 9.6-9 11.2-5.2-1.6-9-5.6-9-11.2V4.5Z";
const SHIELD_INNER_PATH =
  "M12 4 18.6 6.2v5.1c0 4.2-2.7 7.2-6.6 8.5-3.9-1.3-6.6-4.3-6.6-8.5V6.2Z";

// The inner shield above the diagonal from its top-right corner to its lower-left edge.
const SHIELD_UPPER_HALF_PATH =
  "M12 4 18.6 6.2 6.4 16.4C5.8 14.9 5.4 13.2 5.4 11.3V6.2Z";

// Teams without an ESPN logo, such as international exhibition opponents, get a generic shield instead of a logo they don't own.
function GenericShield({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      data-testid="generic-team-logo"
      className="shrink-0 text-muted"
    >
      <path d={SHIELD_OUTLINE_PATH} fill="currentColor" opacity="0.35" />
      <path d={SHIELD_INNER_PATH} fill="currentColor" opacity="0.55" />
      <path d={SHIELD_UPPER_HALF_PATH} fill="currentColor" />
      <path
        d="M18.6 6.2 6.4 16.4"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default function TeamLogo({
  logoUrl,
  size,
  lazy = false,
}: TeamLogoProps) {
  if (!logoUrl) return <GenericShield size={size} />;

  return (
    <img
      // Requested at twice the display size so logos stay sharp on high-density screens.
      src={resizedLogoUrl(logoUrl, size * 2)}
      alt=""
      width={size}
      height={size}
      loading={lazy ? "lazy" : undefined}
    />
  );
}
