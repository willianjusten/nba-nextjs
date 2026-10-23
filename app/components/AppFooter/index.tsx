import { strings } from "@/app/lib/strings";

export default function AppFooter() {
  return (
    <footer className="z-1 container mx-auto px-4 py-6 text-sm text-slate-400">
      <p>{strings.shell.footer}</p>
    </footer>
  );
}
