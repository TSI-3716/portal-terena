import type { Metadata } from "next";
import { LoginForm } from "@/app/login/form";
import { Hero } from "@/components/hero";
import { PageSection } from "@/components/site-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <>
      <Hero
        eyebrow="Área restrita"
        title="Entrar no Portal"
        description="Use o e-mail e a senha já cadastrados no Supabase."
      />
      <PageSection>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-primary">Login</CardTitle>
            <CardDescription>
              Acesse sua conta para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </PageSection>
    </>
  );
}
