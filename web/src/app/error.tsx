"use client";

import { Container } from "@/components/site-layout";
import { Button } from "@/components/ui/button";

/** Exibido quando uma consulta ao banco falha (ex.: tabela ou política ausente). */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-16">
      <div className="max-w-xl space-y-3">
        <h1 className="font-heading text-2xl font-semibold text-primary">
          Não foi possível carregar esta página
        </h1>
        <p className="text-sm text-muted-foreground">
          O conteúdo vem do banco de dados e a consulta falhou. Tente de novo em
          instantes. Se o problema continuar, verifique se as migrations do
          Supabase foram aplicadas.
        </p>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </Container>
  );
}
