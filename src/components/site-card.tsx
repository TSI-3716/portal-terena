import Image from "next/image";
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
  imageSrc,
  imageAlt = "",
}: {
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
  meta?: string;
  search?: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <Card className="pt-0" data-search={search}>
      {imageSrc ? (
        <div className="relative h-36 w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover"
          />
        </div>
      ) : (
        <MediaPlaceholder />
      )}
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
