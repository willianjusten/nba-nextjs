import cn from "classnames";

function Table({
  fullWidth = false,
  children,
}: React.PropsWithChildren<{ fullWidth?: boolean }>) {
  return (
    <table
      className={cn(
        "border-main bg-glass my-5 min-w-full border text-center text-white",
        { "md:min-w-min": !fullWidth },
      )}
    >
      {children}
    </table>
  );
}

function TableCell({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <td
      className={`border-main border px-3 py-2 ${className ? className : ""}`}
    >
      {children}
    </td>
  );
}

function TableHead({ children }: React.PropsWithChildren<{}>) {
  return <thead className="bg-slate-900 font-bold">{children}</thead>;
}

export { Table, TableCell, TableHead };
