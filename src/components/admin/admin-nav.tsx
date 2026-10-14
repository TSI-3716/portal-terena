"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { adminSections } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 md:sticky md:top-24 md:w-48">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className={cn(
          "w-full justify-start",
          pathname === "/admin" && "bg-accent text-accent-foreground",
        )}
      >
        <Link href="/admin">Painel</Link>
      </Button>
      {adminSections.map((section) => (
        <Button
          key={section.href}
          variant="ghost"
          size="sm"
          asChild
          className={cn(
            "w-full justify-start",
            isActive(section.href) && "bg-accent text-accent-foreground",
          )}
        >
          <Link href={section.href}>{section.title}</Link>
        </Button>
      ))}
      <form action={logout} className="mt-4">
        <Button type="submit" variant="outline" size="sm" className="w-full">
          Sair
        </Button>
      </form>
    </nav>
  );
}
