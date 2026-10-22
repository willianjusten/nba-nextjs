import { notFound } from "next/navigation";
import TeamHeader from "@/app/components/TeamHeader";
import { fetchTeamDetail, fetchTeamIdBySlug } from "@/app/lib/espn";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const teamId = await fetchTeamIdBySlug(slug);
  if (!teamId) notFound();

  const team = await fetchTeamDetail(teamId);

  return (
    <section className="flex flex-col gap-4 py-8">
      <TeamHeader team={team} />
    </section>
  );
}
