"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inamatyLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function InamatyNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, pathname]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = direction === "left" ? -220 : 220;
    el.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <div className="group relative mt-4 mb-2 rounded-xl border bg-muted/40">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByAmount("left")}
          aria-label="Rolar menu para a esquerda"
          className={cn(
            "absolute top-1/2 left-1.5 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border bg-background/80 text-foreground shadow-xs backdrop-blur-xs transition-opacity duration-200",
            "opacity-20 group-hover:opacity-65 hover:!opacity-100 focus-visible:opacity-100"
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex items-center gap-1.5 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <span className="shrink-0 px-2 text-xs font-semibold tracking-wide text-primary">
          INAMATY KAXÉ
        </span>
        {inamatyLinks.map((link) => (
          <Button
            key={link.href}
            variant={pathname === link.href ? "default" : "ghost"}
            size="xs"
            asChild
            className="shrink-0"
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByAmount("right")}
          aria-label="Rolar menu para a direita"
          className={cn(
            "absolute top-1/2 right-1.5 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border bg-background/80 text-foreground shadow-xs backdrop-blur-xs transition-opacity duration-200",
            "opacity-20 group-hover:opacity-65 hover:!opacity-100 focus-visible:opacity-100"
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}