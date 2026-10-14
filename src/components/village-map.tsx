import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { staticImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export function VillageMap({
  places,
  className,
  imageSrc = staticImage("home_map"),
}: {
  places: string[];
  className?: string;
  imageSrc?: string | null;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[330px] overflow-hidden rounded-xl border bg-accent",
        className
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt="Mapa de referência das aldeias"
          fill
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-cover opacity-95"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-secondary to-accent" />
      )}
      <div className="relative flex min-h-[330px] flex-wrap items-center justify-around gap-3 p-5">
        {places.map((place) => (
          <Badge
            key={place}
            variant="outline"
            className="h-auto border-2 border-primary bg-background px-3 py-2 text-sm font-bold text-primary shadow-md"
          >
            ● {place}
          </Badge>
        ))}
      </div>
    </div>
  );
}
