"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="senha">Senha</FieldLabel>
          <div className="relative">
            <Input
              id="senha"
              name="senha"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Sua senha"
              className="pr-9"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </Field>
        {state?.error ? <FieldError>{state.error}</FieldError> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
