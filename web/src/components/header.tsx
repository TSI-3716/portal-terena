"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

function SearchField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <InputGroup className={className}>
      <InputGroupInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar no portal..."
        aria-label="Buscar no portal"
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}

function filterCards(value: string) {
  const q = value.toLowerCase().trim();
  document.querySelectorAll("[data-search]").forEach((el) => {
    const haystack = el.getAttribute("data-search")?.toLowerCase() ?? "";
    (el as HTMLElement).style.display = !q || haystack.includes(q) ? "" : "none";
  });
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function onSearch(value: string) {
    setQuery(value);
    filterCards(value);
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm">
      <Container className="flex h-20 items-center gap-3">
        <Link href="/" className="mr-auto flex items-center gap-2.5">
          <span className="flex size-[54px] items-center justify-center rounded-[14px] bg-primary text-[26px] leading-none text-primary-foreground shadow-[inset_0_0_0_2px] shadow-gold">
            🏠
          </span>
          <span className="leading-none">
            <span className="block text-[13px] tracking-[0.8px] text-muted-foreground">
              PORTAL
            </span>
            <span className="block text-[26px] font-semibold tracking-[1px]">
              TERENA
            </span>
          </span>
        </Link>

        <nav className="hidden items-center xl:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                isActive(link.href) && "bg-accent text-accent-foreground"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <SearchField
          className="hidden w-56 md:flex"
          value={query}
          onChange={onSearch}
        />

        <Button
          variant={pathname.startsWith("/login") ? "default" : "outline"}
          size="sm"
          asChild
          className="hidden sm:inline-flex"
        >
          <Link href="/login">Entrar</Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="xl:hidden"
              aria-label="Abrir menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Navegue pelo Portal Terena</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              <SearchField
                className="w-full md:hidden"
                value={query}
                onChange={onSearch}
              />
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    className={cn(
                      "justify-start",
                      isActive(link.href) && "bg-accent text-accent-foreground"
                    )}
                    asChild
                  >
                    <Link href={link.href} onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </nav>
              <Button asChild>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Entrar
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
