import PagePlaceholder from "@/app/components/PagePlaceholder";
import { Hydrate } from "@/app/lib/query/server";
import { strings } from "@/app/lib/strings";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;

  return (
    <Hydrate>
      <PagePlaceholder title={strings.team.title(slug)} />
    </Hydrate>
  );
}
