import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading, PageSection } from "@/components/site-layout";

export function PlaceholderPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <>
      <PageHeading title={title} description={description} />
      <PageSection contained={false} className="pt-4">
        <Card>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {children ??
                "Conteúdo desta tela será preenchido na próxima etapa, a partir do HTML de exemplo."}
            </p>
          </CardContent>
        </Card>
      </PageSection>
    </>
  );
}
