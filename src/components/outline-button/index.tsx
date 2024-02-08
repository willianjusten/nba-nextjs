import cn from "classnames";

type OutlineButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function OutlineButton({
  label,
  active,
  onClick,
}: OutlineButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-transparent font-semibold py-2 px-4 border-2 transition-all duration-200 hover:cursor-pointer rounded hover:opacity-70",
        active && "text-blue-400 border-blue-400"
      )}
    >
      {label}
    </button>
  );
}
