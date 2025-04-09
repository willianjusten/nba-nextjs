import Card from "./Card";
import Connectors from "./Connectors";
import NavBar from "./Navbar";

const EastFirstRound = () => (
  <g transform="translate(1030, -20)">
    <g transform="translate(0,0)">
      <Card />
    </g>
    <g transform="translate(0,148)">
      <Card />
    </g>
    <g transform="translate(0,296)">
      <Card />
    </g>
    <g transform="translate(0,444)">
      <Card />
    </g>
  </g>
);

const EastSecondRound = () => (
  <g transform="translate(836, -20)">
    <g transform="translate(-18,64)">
      <Card />
    </g>
    <g transform="translate(-18,360)">
      <Card />
    </g>
  </g>
);

const EastThirdRound = () => (
  <g transform="translate(715, -20)">
    <g transform="translate(0,210)">
      <Card />
    </g>
  </g>
);

const WestFirstRound = () => (
  <g transform="translate(0, -20)">
    <g transform="translate(0,0)">
      <Card />
    </g>
    <g transform="translate(0,148)">
      <Card />
    </g>
    <g transform="translate(0,296)">
      <Card />
    </g>
    <g transform="translate(0,444)">
      <Card />
    </g>
  </g>
);

const WestSecondRound = () => (
  <g transform="translate(194, -20)">
    <g transform="translate(18,64)">
      <Card />
    </g>
    <g transform="translate(18,360)">
      <Card />
    </g>
  </g>
);

const WestThirdRound = () => (
  <g transform="translate(301, -20)">
    <g transform="translate(18,210)">
      <Card />
    </g>
  </g>
);

const Finals = () => (
  <g transform="translate(499, -20)">
    <g transform="translate(18,210)">
      <Card />
    </g>
  </g>
);

function PlayoffsTable() {
  return (
    <div className="mt-8 overflow-x-scroll md:overflow-auto">
      <NavBar />

      <svg
        viewBox="0 0 1216 593"
        className="relative mx-auto mb-8 block w-[1216px] align-middle md:w-auto"
        preserveAspectRatio="xMidYMin slice"
      >
        <rect className="fill-none" width="1216" height="593"></rect>

        <EastFirstRound />
        <EastSecondRound />
        <EastThirdRound />

        <Connectors />
        <Finals />

        <WestFirstRound />
        <WestThirdRound />
        <WestSecondRound />
      </svg>
    </div>
  );
}

export default PlayoffsTable;
