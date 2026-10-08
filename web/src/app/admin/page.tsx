import Link from "next/link";
import { PageHeading } from "@/components/site-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminSections } from "@/lib/admin";

export default function AdminPage() {
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
                <CardTitle className="text-primary">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
