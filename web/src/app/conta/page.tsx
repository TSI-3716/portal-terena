import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";
import { Hero } from "@/components/hero";
import { PageSection } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export const metadata: Metadata = { title: "Minha conta" };

export default async function ContaPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <>
      <Hero
        eyebrow="Bem-vindo de volta"
        title="Minha conta"
        description="O login com o Supabase Auth funcionou."
      />
      <PageSection>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-primary">Sessão ativa</CardTitle>
            <CardDescription>Você está autenticado no portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-primary">E-mail</p>
              <p className="text-sm text-muted-foreground">{data.user.email}</p>
            </div>
            <form action={logout}>
              <Button type="submit" variant="outline">
                Sair
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageSection>
    </>
  );
}
