import Card from "./Card";
import Connectors from "./Connectors";
import NavBar from "./Navbar";

const EastFirstRound = ({ data }) => {
  return (
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
};

const EastSecondRound = ({ data }) => (
  <g transform="translate(836, -20)">
    <g transform="translate(-18,64)">
      <Card data={data[0]} />
    </g>
    <g transform="translate(-18,360)">
      <Card data={data[1]} />
    </g>
  </g>
);

const EastThirdRound = ({ data }) => (
  <g transform="translate(715, -20)">
    <g transform="translate(0,210)">
      <Card data={data[0]} />
    </g>
  </g>
);

const WestFirstRound = ({ data }) => (
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

const WestSecondRound = ({ data }) => (
  <g transform="translate(194, -20)">
    <g transform="translate(18,64)">
      <Card data={data[0]} />
    </g>
    <g transform="translate(18,360)">
      <Card data={data[1]} />
    </g>
  </g>
);

const WestThirdRound = ({ data }) => (
  <g transform="translate(301, -20)">
    <g transform="translate(18,210)">
      <Card data={data[0]} />
    </g>
  </g>
);

const Finals = ({ data }) => (
  <g transform="translate(499, -20)">
    <g transform="translate(18,210)">
      <Card data={data[0]} />
    </g>
  </g>
);

function PlayoffsTable({ east, west, nbaFinals }) {
  return (
    <div className="mt-8 overflow-x-scroll md:overflow-auto">
      <NavBar />

      <svg
        viewBox="0 0 1216 593"
        className="relative mx-auto mb-8 block w-[1216px] align-middle md:w-auto"
        preserveAspectRatio="xMidYMin slice"
      >
        <rect className="fill-none" width="1216" height="593"></rect>

        <EastFirstRound data={east.firstRound} />
        <EastSecondRound data={east.semifinals} />
        <EastThirdRound data={east.finals} />

        <Connectors />
        <Finals data={nbaFinals} />

        <WestFirstRound data={west.firstRound} />
        <WestThirdRound data={west.finals} />
        <WestSecondRound data={west.semifinals} />
      </svg>
    </div>
  );
}

export default PlayoffsTable;
