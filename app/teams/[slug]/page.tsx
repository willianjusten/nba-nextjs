import { notFound } from "next/navigation";
import TeamHeader from "@/app/components/TeamHeader";
import TeamRoster from "@/app/components/TeamRoster";
import TeamSchedule from "@/app/components/TeamSchedule";
import {
  fetchTeamDetail,
  fetchTeamIdBySlug,
  fetchTeamRoster,
  fetchTeamSchedule,
} from "@/app/lib/espn";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const teamId = await fetchTeamIdBySlug(slug);
  if (!teamId) notFound();

  const [team, games, players] = await Promise.all([
    fetchTeamDetail(teamId),
    fetchTeamSchedule(teamId),
    fetchTeamRoster(teamId),
  ]);

  return (
    <section className="flex flex-col gap-8 py-8">
      <TeamHeader team={team} />
      <TeamSchedule teamId={teamId} games={games} />
      <TeamRoster players={players} />
    </section>
  );
}
