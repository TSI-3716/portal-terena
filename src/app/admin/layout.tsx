import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Container } from "@/components/site-layout";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Administração" };

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <Container className="py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        <AdminNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </Container>
  );
}
