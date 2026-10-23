import { strings } from "@/app/lib/strings";

export default function AppFooter() {
  return (
    <footer className="relative border-t border-white/8">
      <p className="container mx-auto px-4 py-6 text-xs text-muted">
        {strings.shell.footer}
      </p>
    </footer>
  );
}
