"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/nav";

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
    const q = value.toLowerCase().trim();
    document.querySelectorAll("[data-search]").forEach((el) => {
      const haystack = el.getAttribute("data-search")?.toLowerCase() ?? "";
      (el as HTMLElement).style.display = !q || haystack.includes(q) ? "" : "none";
    });
  }

  return (
    <header className="topbar">
      <div className="site-container nav">
        <Link className="brand" href="/">
          <div className="logo-mark">🏠</div>
          <div className="brand-text">
            <small>PORTAL</small>
            <strong>TERENA</strong>
          </div>
        </Link>
        <button
          className="menu"
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>
        <nav className={open ? "navlinks open" : "navlinks"}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="search">
          <input
            value={query}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar no portal..."
          />
          <button type="button">⌕</button>
        </div>
        <Link
          className={pathname.startsWith("/login") ? "auth-nav active" : "auth-nav"}
          href="/login"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
