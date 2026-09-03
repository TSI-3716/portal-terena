"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { inamatyLinks } from "@/lib/nav";

export function InamatyNav() {
  const pathname = usePathname();

  return (
    <div className="inamaty-local">
      <strong>INAMATY KAXÉ</strong>
      {inamatyLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? "active" : ""}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
