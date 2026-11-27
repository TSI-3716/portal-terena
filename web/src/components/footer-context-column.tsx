"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { culturaLinks, inamatyFooterLinks } from "@/lib/nav";

/**
 * Terceira coluna do rodapé: nas páginas da Inamaty Kaxé mostra os atalhos
 * da aldeia (como no HTML original); no restante do portal, a coluna Cultura.
 */
export function FooterContextColumn() {
  const pathname = usePathname();
  const inamaty = pathname.startsWith("/aldeias/inamaty-kaxe");

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold tracking-wide text-primary">
        {inamaty ? (
          "INAMATY KAXÉ"
        ) : (
          <Link href="/cultura" className="hover:underline">
            CULTURA
          </Link>
        )}
      </h3>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {(inamaty ? inamatyFooterLinks : culturaLinks).map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
