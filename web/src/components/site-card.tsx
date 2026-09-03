import Link from "next/link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SiteCard({
  title,
  description,
  href,
  hrefLabel = "Ver mais",
  meta,
  search,
}: {
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
  meta?: string;
  search?: string;
}) {
  return (
    <Card className="pt-0" data-search={search}>
      <MediaPlaceholder />
      <CardHeader>
        {meta ? <Badge variant="secondary">{meta}</Badge> : null}
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        {href ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={href}>{hrefLabel}</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            {hrefLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
