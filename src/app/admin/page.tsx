import Link from "next/link";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminSections } from "@/lib/admin";
import { contarMensagensNaoLidas } from "@/lib/contato";

export default async function AdminPage() {
  const naoLidas = await contarMensagensNaoLidas();

  return (
    <>
      <PageHeading
        title="Administração"
        description="Gerencie os conteúdos publicados no portal."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {adminSections.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  {section.title}
                  {section.href === "/admin/mensagens" && naoLidas > 0 ? (
                    <Badge>
                      {naoLidas} {naoLidas === 1 ? "nova" : "novas"}
                    </Badge>
                  ) : null}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
