import PagePlaceholder from "@/app/components/PagePlaceholder";
import { Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";

export default function StandingsPage() {
  return (
    <Hydrate>
      <PagePlaceholder title={strings.standings.title} />
    </Hydrate>
  );
}
