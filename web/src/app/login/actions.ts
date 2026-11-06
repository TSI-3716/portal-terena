"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { registrarLog } from "@/lib/logger";
import { createClient } from "@/lib/supabase";
import { isEmail, MENSAGENS } from "@/lib/validation";

export async function login(
  prev: { error: string; email: string; senha: string; attempt: number } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");
  const attempt = (prev?.attempt ?? 0) + 1;

  if (!email || !senha) {
    return { error: "Informe e-mail e senha.", email, senha, attempt };
  }

  if (!isEmail(email)) {
    return { error: MENSAGENS.email, email, senha, attempt };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    await registrarLog({
      tipo: "login_falha",
      nivel: "aviso",
      mensagem: "Tentativa de login recusada",
      detalhes: { email, motivo: error.code ?? error.message },
    }, supabase);
    return { error: "E-mail ou senha inválidos.", email, senha, attempt };
  }

  await registrarLog({ tipo: "login", mensagem: "Login realizado" }, supabase);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  // Registra antes de sair, enquanto a sessão ainda identifica o usuário.
  const supabase = await createClient();
  await registrarLog({ tipo: "logout", mensagem: "Sessão encerrada" }, supabase);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
