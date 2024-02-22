import { forwardRef } from "react";
import cn from "classnames";

type OutlineButtonProps = {
  label: string | React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
};

function OutlineButton(
  { label, active, icon, onClick, ...rest }: OutlineButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "rounded border-2 bg-transparent px-4 py-2 font-semibold transition-all duration-200 hover:cursor-pointer hover:opacity-70",
        active && "border-blue-400 text-blue-400",
      )}
      {...rest}
    >
      <div className="flex items-center">
        {icon}
        {label}
      </div>
    </button>
  );
}

export default forwardRef<HTMLButtonElement, OutlineButtonProps>(OutlineButton);
