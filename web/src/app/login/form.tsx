"use client";

import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form className="form-grid login-form" action={action}>
      <div className="form-field full">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="h-10"
          placeholder="seu@email.com"
          required
        />
      </div>
      <div className="form-field full">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          className="h-10"
          placeholder="Sua senha"
          required
        />
      </div>
      {state?.error ? (
        <div className="form-field full">
          <p className="form-error">{state.error}</p>
        </div>
      ) : null}
      <div className="form-field full">
        <Button type="submit" className="h-10 px-4" disabled={pending}>
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
