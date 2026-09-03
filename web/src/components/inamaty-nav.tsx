"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { inamatyLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function InamatyNav() {
  const pathname = usePathname();

  return (
    <div className="mt-4 mb-2 flex items-center gap-2 overflow-x-auto rounded-xl border bg-muted/40 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 px-2 text-xs font-semibold tracking-wide text-primary">
        INAMATY KAXÉ
      </span>
      {inamatyLinks.map((link) => (
        <Button
          key={link.href}
          variant={pathname === link.href ? "default" : "ghost"}
          size="xs"
          asChild
          className={cn("shrink-0")}
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
}
