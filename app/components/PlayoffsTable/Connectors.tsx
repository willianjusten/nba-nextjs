const connectorPaths = {
  west: {
    firstToSecond: [
      {
        transform: "translate(180,61.5)",
        points: "0,0 16,0 16,64 32,64 16,64 16,148, 0,148",
      },
      {
        transform: "translate(180,357.5)",
        points: "0,0 16,0 16,64 32,64 16,64 16,148, 0,148",
      },
    ],
    secondToThird: [
      { transform: "translate(392,125.5)", points: "0,0 16,0 16,105" },
      { transform: "translate(392,421.5)", points: "0,0 16,0 16,-108" },
    ],
    thirdToFinals: [{ transform: "translate(500,271.5)", points: "0,0 16,0" }],
  },
  east: {
    firstToSecond: [
      {
        transform: "translate(998,61.5)",
        points: "32,0 16,0 16,64 0,64 16,64 16,148, 32,148",
      },
      {
        transform: "translate(998,357.5)",
        points: "32,0 16,0 16,64 0,64 16,64 16,148, 32,148",
      },
    ],
    secondToThird: [
      { transform: "translate(816,125.5)", points: "0,0 -16,0 -16,105" },
      { transform: "translate(816,421.5)", points: "0,0 -16,0 -16,-108" },
    ],
    thirdToFinals: [{ transform: "translate(698,271.5)", points: "0,0 16,0" }],
  },
};

type Connector = {
  transform: string;
  points: string;
};

function Connectors() {
  const renderConnectors = (connectors: Connector[]) =>
    connectors.map((connector: Connector, i: number) => (
      <polyline
        key={i}
        transform={connector.transform}
        points={connector.points}
      />
    ));

  return (
    <g className="fill-none stroke-white stroke-1" transform="translate(0,-10)">
      {renderConnectors(connectorPaths.west.firstToSecond)}
      {renderConnectors(connectorPaths.west.secondToThird)}
      {renderConnectors(connectorPaths.west.thirdToFinals)}

      {renderConnectors(connectorPaths.east.firstToSecond)}
      {renderConnectors(connectorPaths.east.secondToThird)}
      {renderConnectors(connectorPaths.east.thirdToFinals)}
    </g>
  );
}

export default Connectors;
