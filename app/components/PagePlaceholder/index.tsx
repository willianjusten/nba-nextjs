import { strings } from "@/app/lib/strings";

type PagePlaceholderProps = {
  title: string;
};

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section className="flex flex-col gap-2 py-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-slate-300">{strings.common.comingSoon}</p>
    </section>
  );
}
