const WinnerIndicator = ({ conference = "east" }: { conference: string }) => {
  const transform =
    conference === "east" ? "translate(0, 0)" : "translate(176, 0)";

  return (
    <rect
      height="40"
      width="4"
      transform={transform}
      className="fill-[#1c7ad3]"
    ></rect>
  );
};

function Card() {
  return (
    <svg
      viewBox="0 0 180 134"
      height="134"
      width="180"
      className="block align-middle"
    >
      <g transform="translate(0, 32)">
        <rect height="40" width="180" className="fill-[#70738529]"></rect>
        <g className="text-xs">
          <WinnerIndicator conference="west" />
          <text
            transform="translate(8,0)"
            dy="24"
            className=" fill-white text-center font-normal"
          >
            1
          </text>
          <image
            transform="translate(20, 8)"
            width="24"
            height="24"
            xlinkHref="https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg"
          ></image>
          <text
            transform="translate(48, 0)"
            dy="24"
            className=" fill-white text-center font-bold"
          >
            Timberwolves
          </text>
          <text
            transform="translate(140, 0)"
            dy="24"
            className="fill-white text-center text-[10px] font-bold"
          >
            40-31
          </text>
        </g>
      </g>
      <g transform="translate(0, 73)">
        <rect height="40" width="180" className="fill-[#70738529]"></rect>
        <g className="text-xs">
          <text
            transform="translate(8, 0)"
            dy="24"
            className=" fill-white text-center"
          >
            8
          </text>
          <image
            transform="translate(20, 8)"
            width="24"
            height="24"
            xlinkHref="https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg"
          ></image>
          <text
            transform="translate(48, 0)"
            dy="24"
            className=" fill-white text-center font-bold"
          >
            Trail Blazors
          </text>
          <text
            transform="translate(140, 0)"
            dy="24"
            className=" fill-white text-center text-[10px] font-bold"
          >
            40-31
          </text>
        </g>
      </g>
      <g transform="translate(0, 114)">
        <rect height="20" width="180" className="fill-[#70738529]"></rect>
        <text dy="13" dx="4" className=" fill-white text-center text-[10px] ">
          <tspan font-weight="900">MIA WINS </tspan>4-1
        </text>
      </g>
    </svg>
  );
}

export default Card;
