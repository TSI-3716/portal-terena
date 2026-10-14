import { cn } from "@/lib/utils";

/** Faixa grafismo marrom exibida abaixo dos banners (".pattern" no HTML original). */
export function PatternStripe({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative h-2.5 bg-brown", className)}
    >
      <div className="absolute inset-x-0 inset-y-0.5 bg-[repeating-linear-gradient(90deg,transparent_0_14px,rgba(255,255,255,.55)_14px_17px,transparent_17px_28px)] opacity-60" />
    </div>
  );
}
