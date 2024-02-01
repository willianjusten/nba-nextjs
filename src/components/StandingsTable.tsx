import cn from "classnames";
import Image from "next/image";

import { Table, TableCell, TableHead } from "@/components/Table";

export const isPlayoff = (i: number) => i <= 5;
export const isPlayin = (i: number) => i >= 6 && i < 10;

export function StandingTable({ label, conference }) {
  const standing_colors = {
    playoff: "bg-green-600",
    playin: "bg-sky-600",
  };

  return (
    <div className="overflow-x-auto py-5">
      <h1 className="text-3xl font-bold text-white">{label}</h1>
      <Table fullWidth>
        <TableHead>
          <tr>
            <TableCell>Rank</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Win</TableCell>
            <TableCell>Loss</TableCell>
            <TableCell>Win %</TableCell>
            <TableCell>GB</TableCell>
            <TableCell>Home Record</TableCell>
            <TableCell>Road Record</TableCell>
            <TableCell>L10 Streak</TableCell>
            <TableCell>Streak</TableCell>
          </tr>
        </TableHead>
        <tbody>
          {conference.map((team, index) => (
            <tr key={team.name}>
              <TableCell>
                <div
                  className={cn("rounded-full", {
                    [standing_colors.playoff]: isPlayoff(index),
                    [standing_colors.playin]: isPlayin(index),
                  })}>
                  {index + 1}
                </div>
              </TableCell>
              <TableCell className="flex items-center gap-2 min-w-48">
                <Image
                  src={`https://cdn.nba.com/logos/nba/${team.id}/primary/L/logo.svg`}
                  width={40}
                  height={40}
                  alt={team.name}
                />
                <span>{team.name}</span>
              </TableCell>
              <TableCell>{team.win}</TableCell>
              <TableCell>{team.loss}</TableCell>
              <TableCell>{team.percentage}</TableCell>
              <TableCell>
                {team.gamesBehind === "0.0" ? "-" : team.gamesBehind}
              </TableCell>
              <TableCell>{team.homeRecord}</TableCell>
              <TableCell>{team.awayRecord}</TableCell>
              <TableCell>{team.lastTenRecord}</TableCell>
              <TableCell>{team.streak}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="flex justify-center">
        <div className="mr-6 flex items-center">
          <div
            className={`mr-2 h-5 w-10 rounded-full ${standing_colors.playoff}`}></div>
          <span className="text-sm text-gray-400">Playoffs</span>
        </div>
        <div className="flex items-center">
          <div
            className={`mr-2 h-5 w-10 rounded-full ${standing_colors.playin}`}></div>
          <span className="text-sm text-gray-400">Play-In Tournament</span>
        </div>
      </div>
    </div>
  );
}
