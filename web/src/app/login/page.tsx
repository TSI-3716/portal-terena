import type { Metadata } from "next";
import { LoginForm } from "@/app/login/form";
import { Hero } from "@/components/hero";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <>
      <Hero
        eyebrow="Área restrita"
        title="Entrar no Portal"
        description="Use o e-mail e a senha já cadastrados no Supabase."
      />
      <section className="section">
        <div className="site-container">
          <div className="login-wrap">
            <div className="panel">
              <h2>🔐 Login</h2>
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
