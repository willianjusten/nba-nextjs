import Image from "next/image";

// Isn't really necessary to have this type, we should use GameTeam from game-card
type TeamInfoProps = {
  team: {
    teamId: number;
    teamName: string;
    wins?: number;
    losses?: number;
  };
};

function TeamInfo({ team }: TeamInfoProps) {
  const teamName = team.teamName || "TBD";
  const logo = !!team.teamId
    ? `https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`
    : "https://cdn.nba.com/logos/nba/fallback.svg";
  const hasRecord = team.wins !== undefined && team.losses !== undefined;

  return (
    <div className="flex w-1/4 flex-col items-center text-center">
      <Image src={logo} width={48} height={48} alt={team.teamName} />
      <p className="mt-1 whitespace-nowrap text-sm font-semibold">{teamName}</p>
      {hasRecord && (
        <p className="text-xs text-gray-400">{`${team.wins}-${team.losses}`}</p>
      )}
    </div>
  );
}

export default TeamInfo;
