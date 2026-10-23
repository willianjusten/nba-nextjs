import PagePlaceholder from "@/app/components/PagePlaceholder";
import { Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";

export default function PlayoffsPage() {
  return (
    <Hydrate>
      <PagePlaceholder title={strings.playoffs.title} />
    </Hydrate>
  );
}
