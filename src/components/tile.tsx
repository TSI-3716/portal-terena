import type { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Tile({
  icon,
  title,
  description,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <Card className="h-full transition-colors hover:bg-accent/40">
      <CardHeader>
        <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
          {icon}
        </div>
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
