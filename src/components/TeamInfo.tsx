import Image from "next/image";

export function TeamInfo({ team }) {
  return (
    <div className="flex w-1/4 flex-col items-center text-center">
      <Image
        src={`https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`}
        width={48}
        height={48}
        alt={team.teamName}
      />
      <p className="mt-1 whitespace-nowrap text-sm font-semibold">
        {team.teamName}
      </p>
      {team.wins && team.losses && (
        <p className="text-xs text-gray-400">{`${team.wins}-${team.losses}`}</p>
      )}
    </div>
  );
}
