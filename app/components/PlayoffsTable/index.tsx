import { PlayoffBracket, PlayoffRound } from "@/app/api/types";
import Card from "./Card";
import Connectors from "./Connectors";
import NavBar from "./Navbar";

type PlayoffsRoundProps = {
  data: PlayoffRound[];
};

const EastFirstRound = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(1030, -20)">
    <g transform="translate(0,0)">
      <Card data={data[0]} />
    </g>
    <g transform="translate(0,148)">
      <Card data={data[1]} />
    </g>
    <g transform="translate(0,296)">
      <Card data={data[2]} />
    </g>
    <g transform="translate(0,444)">
      <Card data={data[3]} />
    </g>
  </g>
);

const EastSecondRound = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(836, -20)">
    <g transform="translate(-18,64)">
      <Card data={data[0]} />
    </g>
    <g transform="translate(-18,360)">
      <Card data={data[1]} />
    </g>
  </g>
);

const EastThirdRound = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(715, -20)">
    <g transform="translate(0,210)">
      <Card data={data[0]} />
    </g>
  </g>
);

const WestFirstRound = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(0, -20)">
    <g transform="translate(0,0)">
      <Card data={data[0]} />
    </g>
    <g transform="translate(0,148)">
      <Card data={data[1]} />
    </g>
    <g transform="translate(0,296)">
      <Card data={data[2]} />
    </g>
    <g transform="translate(0,444)">
      <Card data={data[3]} />
    </g>
  </g>
);

const WestSecondRound = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(194, -20)">
    <g transform="translate(18,64)">
      <Card data={data[0]} />
    </g>
    <g transform="translate(18,360)">
      <Card data={data[1]} />
    </g>
  </g>
);

const WestThirdRound = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(301, -20)">
    <g transform="translate(18,210)">
      <Card data={data[0]} />
    </g>
  </g>
);

const Finals = ({ data }: PlayoffsRoundProps) => (
  <g transform="translate(499, -20)">
    <g transform="translate(18,210)">
      <Card data={data[0]} />
    </g>
  </g>
);

function PlayoffsTable({ east, west, nbaFinals }: PlayoffBracket) {
  return (
    <div className="flex flex-grow items-center">
      <div className="w-full overflow-x-scroll md:overflow-auto">
        <NavBar />

        <svg
          viewBox="0 0 1216 593"
          className="relative mx-auto block w-[1216px] align-middle md:w-auto"
          preserveAspectRatio="xMidYMin slice"
        >
          <Connectors />

          <EastFirstRound data={east.firstRound} />
          <EastSecondRound data={east.secondRound} />
          <EastThirdRound data={east.thirdRound} />

          <Finals data={nbaFinals} />

          <WestFirstRound data={west.firstRound} />
          <WestSecondRound data={west.secondRound} />
          <WestThirdRound data={west.thirdRound} />
        </svg>
      </div>
    </div>
  );
}

export default PlayoffsTable;
