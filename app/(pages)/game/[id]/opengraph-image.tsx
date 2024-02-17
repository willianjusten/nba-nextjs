/* eslint-disable @next/next/no-img-element */
import { format } from "date-fns";
import { ImageResponse } from "next/og";

export const runtime = "edge";

async function getData(id: string) {
  const res = await fetch(`${process.env.API_DOMAIN}/api/game/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data;
}

export default async function GET({ params }: { params: { id: string } }) {
  const data = await getData(params.id);

  if (!data.game) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            color: "black",
            background:
              "linear-gradient(160deg,rgba(14,25,44,.3) 55%,rgba(200,15,46,.3))",
            backgroundColor: "rgb(15 23 42/1)",
            width: "100%",
            height: "100%",
            padding: "70px 200px",
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div tw="flex w-full flex-col justify-between mt-10">
            <div tw="flex text-center justify-center w-full text-white mb-10">
              <img
                src="https://nba.willianjusten.com.br/images/nba-logo.svg"
                alt="NBA"
                width={585}
                height={341}
              />
            </div>
            <div tw="flex p-2 text-[20px] text-white w-full justify-center">
              <p>
                Results and Standings powered by
                <span tw="text-blue-600 ml-2">nba.willianjusten.com.br</span>
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }

  const gameDate = format(new Date(data.game?.gameTimeUTC), "dd/MM/yyyy");
  const homeTeam = data.game?.homeTeam;
  const awayTeam = data.game?.awayTeam;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background:
            "linear-gradient(160deg,rgba(14,25,44,.3) 55%,rgba(200,15,46,.3))",
          backgroundColor: "rgb(15 23 42/1)",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div tw="flex w-full flex-col justify-between">
          <div tw="flex text-center justify-center w-full text-white mb-10">
            Day of the game: {gameDate}
          </div>
          <div tw="flex p-6">
            <div tw="flex w-1/4 flex-col items-center text-center">
              <img
                src={`https://cdn.nba.com/logos/nba/${homeTeam.teamId}/primary/L/logo.svg`}
                width={240}
                height={240}
                alt={homeTeam.teamName}
              />
              <p tw="mt-1 text-white font-bold">{homeTeam.teamName}</p>
            </div>

            <div tw="mt-10 flex flex-1">
              <p tw="flex-1 px-3 pt-1.5 text-center justify-center text-white uppercase">
                X
              </p>
            </div>

            <div tw="flex w-1/4 flex-col items-center text-center">
              <img
                src={`https://cdn.nba.com/logos/nba/${awayTeam.teamId}/primary/L/logo.svg`}
                width={240}
                height={240}
                alt={awayTeam.teamName}
              />
              <p tw="mt-1 text-white font-semibold">{awayTeam.teamName}</p>
            </div>
          </div>
          <div tw="flex p-2 text-[20px] text-blue-600 w-full justify-center">
            nba.willianjusten.com.br
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
