export type ChevronIconProps = {
  size?: number;
} & React.HTMLAttributes<SVGElement>;

function ChevronIcon({ size = 12, ...rest }: ChevronIconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...rest}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.8 3.1c.2.2.3.5 0 .7L5.5 7.5 9 11.2a.5.5 0 0 1-.8.6l-3.7-4a.5.5 0 0 1 0-.6l3.7-4c.2-.2.5-.3.7 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default ChevronIcon;
