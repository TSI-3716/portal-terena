import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
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
      <section className="section">
        <div className="site-container">
          <div className="login-wrap">
            <div className="panel">
              <h2>👤 Sessão ativa</h2>
              <div className="list">
                <div className="list-item">
                  <strong>E-mail</strong>
                  {data.user.email}
                </div>
              </div>
              <form action={logout}>
                <Button type="submit" variant="outline" className="h-10 px-4">
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
