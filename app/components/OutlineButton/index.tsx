import cn from "classnames";

type OutlineButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function OutlineButton({ label, active, onClick }: OutlineButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded border-2 bg-transparent px-4 py-2 font-semibold transition-all duration-200 hover:cursor-pointer hover:opacity-70",
        active && "border-blue-400 text-blue-400",
      )}
    >
      {label}
    </button>
  );
}

export default OutlineButton;
