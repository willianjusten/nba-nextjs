export const GlassRect = ({
  width,
  height,
  className = "",
}: {
  width: number;
  height: number;
  className?: string;
}) => (
  <rect height={height} width={width} className={`fill-glass ${className}`} />
);

export const SvgText = ({
  x,
  y,
  children,
  className = "",
}: {
  x?: number;
  y?: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <text
    dy={y}
    transform={`translate(${x}, 0)`}
    className={`fill-white text-center font-bold ${className}`}
  >
    {children}
  </text>
);
