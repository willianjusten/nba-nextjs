import { SvgText } from "./SVGHelpers";

type NavItemProps = {
  position: number;
  conference: string;
  title: string;
};

function NavBar() {
  const navItems: NavItemProps[] = [
    { position: 40, conference: "WEST", title: "First Round" },
    { position: 240, conference: "WEST", title: "Conf. Semifinals" },
    { position: 387, conference: "WEST", title: "Conf. Finals" },
    { position: 520, conference: "NBA", title: "Finals" },
    { position: 657, conference: "EAST", title: "Conf. Finals" },
    { position: 798, conference: "EAST", title: "Conf. Semifinals" },
    { position: 999, conference: "EAST", title: "First Round" },
  ];

  const NavItem = ({ position, conference, title }: NavItemProps) => (
    <g transform={`translate(${position},5)`} textAnchor="middle">
      <SvgText x={0} y={10} className="text-[10px]">
        {conference}
      </SvgText>
      <SvgText x={0} y={30} className="text-sm">
        {title}
      </SvgText>
    </g>
  );

  return (
    <div className="relative max-w-[100%]">
      <div className="w-[1216px] md:w-auto">
        <svg
          viewBox="0 0 1041 64"
          className="block align-middle"
          preserveAspectRatio="xMidYMin slice"
        >
          <rect className="fill-none" width="1041" height="64"></rect>
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default NavBar;
