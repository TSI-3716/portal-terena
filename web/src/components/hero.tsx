import { Container } from "@/components/site-layout";

export function Hero({
  eyebrow,
  title,
  description,
  contained = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  contained?: boolean;
}) {
  const content = (
    <section className="relative overflow-hidden rounded-xl bg-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-green2 to-brown" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/20" />
      <div className="relative z-10 flex min-h-[260px] max-w-xl flex-col justify-center gap-3 px-6 py-10 text-primary-foreground md:min-h-[280px] md:px-10">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-90">
          {eyebrow}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-primary-foreground/85">
          {description}
        </p>
      </div>
    </section>
  );

  if (!contained) return content;
  return <Container className="pt-4">{content}</Container>;
}
