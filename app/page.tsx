import PagePlaceholder from "@/app/components/PagePlaceholder";
import { Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";

export default function HomePage() {
  return (
    <Hydrate>
      <PagePlaceholder title={strings.home.title} />
    </Hydrate>
  );
}
