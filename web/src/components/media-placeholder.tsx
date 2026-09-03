import { cn } from "@/lib/utils";

export function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-36 w-full bg-gradient-to-br from-primary via-green2 to-brown",
        className
      )}
    />
  );
}
