import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function VillageMap({
  places,
  className,
}: {
  places: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[320px] overflow-hidden rounded-xl border bg-accent",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-secondary to-accent" />
      <div className="relative flex min-h-[320px] flex-wrap items-center justify-around gap-3 p-6">
        {places.map((place) => (
          <Badge
            key={place}
            variant="outline"
            className="h-auto border-primary bg-background px-3 py-1.5 text-sm text-primary"
          >
            {place}
          </Badge>
        ))}
      </div>
    </div>
  );
}
