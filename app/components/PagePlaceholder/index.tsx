import { strings } from "@/app/lib/strings";

type PagePlaceholderProps = {
  title: string;
};

export default function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <section className="flex flex-col gap-2 py-8">
      <h1 className="font-display text-5xl leading-none tracking-[0.01em]">
        {title}
      </h1>
      <p className="text-secondary">{strings.common.comingSoon}</p>
    </section>
  );
}
