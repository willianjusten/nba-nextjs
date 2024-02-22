export type CalendarIconProps = {
  size?: number;
} & React.HTMLAttributes<SVGElement>;

function CalendarIcon({ size = 12, ...rest }: CalendarIconProps) {
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
        d="M4.5 1c.3 0 .5.2.5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1.5c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5h-10c-.8 0-1.5-.7-1.5-1.5v-9C1 2.7 1.7 2 2.5 2H4v-.5c0-.3.2-.5.5-.5ZM10 3v.5a.5.5 0 0 0 1 0V3h1.5c.3 0 .5.2.5.5V5H2V3.5c0-.3.2-.5.5-.5H4v.5a.5.5 0 0 0 1 0V3h5ZM2 6v6.5c0 .3.2.5.5.5h10c.3 0 .5-.2.5-.5V6H2Zm5 1.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM9.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm.5 1.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM9 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM7.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM5 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0ZM3.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM3 11.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default CalendarIcon;
