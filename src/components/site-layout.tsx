import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5", className)}>
      {children}
    </div>
  );
}

export function PageSection({
  children,
  muted = false,
  contained = true,
  className,
}: {
  children: ReactNode;
  muted?: boolean;
  contained?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("py-10", muted && "bg-muted/70", className)}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-primary">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mt-6 mb-2 space-y-1.5">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-primary">
        {title}
      </h1>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
