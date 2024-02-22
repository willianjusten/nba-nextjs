export type ArrowIconProps = {
  size?: number;
} & React.HTMLAttributes<SVGElement>;

function ArrowIcon({ size = 12, ...rest }: ArrowIconProps) {
  return (
    <svg
      fill="none"
      color="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...rest}
    >
      <path
        d="M0 6a.8.8 0 0 1 .8-.8h10a.8.8 0 0 1 0 1.5H.8A.8.8 0 0 1 0 6Z"
        fill="#CCC7C3"
      />
      <path
        d="M6.3.5a.8.8 0 0 1 0 1L1.8 6l4.5 4.5a.8.8 0 1 1-1 1l-5-5a.8.8 0 0 1 0-1l5-5a.8.8 0 0 1 1 0Z"
        fill="#CCC7C3"
      />
    </svg>
  );
}

export default ArrowIcon;
