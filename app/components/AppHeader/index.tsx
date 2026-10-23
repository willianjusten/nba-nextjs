import { Suspense } from "react";
import Link from "next/link";
import PrimaryNavigation, {
  PrimaryNavigationFallback,
} from "@/app/components/PrimaryNavigation";
import { NBA_LOGO_URL, resizedLogoUrl } from "@/app/lib/espn";
import { strings } from "@/app/lib/strings";

const LOGO_DISPLAY_SIZE = 40;
// Requested at twice the display size so the logo stays sharp on high-density screens.
const LOGO_REQUEST_SIZE = LOGO_DISPLAY_SIZE * 2;

export default function AppHeader() {
  return (
    <header className="z-1 container mx-auto flex items-center justify-between gap-4 px-4 py-3">
      <Link
        href="/"
        aria-label={strings.shell.logoLabel}
        className="flex min-h-11 items-center"
      >
        <img
          src={resizedLogoUrl(NBA_LOGO_URL, LOGO_REQUEST_SIZE)}
          alt=""
          width={LOGO_DISPLAY_SIZE}
          height={LOGO_DISPLAY_SIZE}
        />
      </Link>
      <Suspense fallback={<PrimaryNavigationFallback />}>
        <PrimaryNavigation />
      </Suspense>
    </header>
  );
}
