"use client";

import { useState, useTransition, type FormEvent } from "react";
import { CircleAlert, RotateCcw, Send, ShieldCheck } from "lucide-react";
import {
  enviarContatoAldeia,
  enviarContatoPortal,
  type EnvioContatoResult,
} from "@/app/contato/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  contatoAldeiaSchema,
  contatoAssuntoLabel,
  contatoAssuntos,
  contatoSchema,
  fieldErrorsFrom,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Variant = "portal" | "aldeia";

const initialValues = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "",
  mensagem: "",
  autorizacao: false,
  website: "",
};

type Values = typeof initialValues;

/**
 * Estratégia por variante: cada formulário valida com seu schema
 * e envia pela server action correspondente.
 */
const strategies: Record<
  Variant,
  {
    validate: (values: Values) => Record<string, string> | null;
    submit: (values: Values) => Promise<EnvioContatoResult>;
  }
> = {
  portal: {
    validate: (values) => {
      const result = contatoSchema.safeParse(values);
      return result.success ? null : fieldErrorsFrom(result.error);
    },
    submit: (values) => enviarContatoPortal(values),
  },
  aldeia: {
    validate: (values) => {
      const result = contatoAldeiaSchema.safeParse(values);
      return result.success ? null : fieldErrorsFrom(result.error);
    },
    submit: (values) =>
      enviarContatoAldeia({
        nome: values.nome,
        email: values.email,
        assunto: values.assunto,
        mensagem: values.mensagem,
        autorizacao: values.autorizacao,
        website: values.website,
      }),
  },
};

export function ContactForm({
  variant = "portal",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "sent" } | { kind: "error"; message: string }
  >({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const strategy = strategies[variant];
  const isPortal = variant === "portal";
  const id = (name: string) => `${variant}-${name}`;

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setStatus({ kind: "idle" });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = strategy.validate(values);

    if (nextErrors) {
      setErrors(nextErrors);
      setStatus({ kind: "idle" });
      return;
    }

    setErrors({});
    startTransition(async () => {
      const result = await strategy.submit(values);
      if (result.ok) {
        setValues(initialValues);
        setStatus({ kind: "sent" });
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setStatus({ kind: "error", message: result.message });
    });
  }

  return (
    <form className={cn("mt-4", className)} onSubmit={onSubmit} noValidate>
      {/* Campo-armadilha anti-spam: invisível para pessoas. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("website")}>Não preencha este campo</label>
        <input
          id={id("website")}
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>

      <FieldGroup className="gap-4 sm:grid sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.nome) || undefined}>
          <FieldLabel htmlFor={id("nome")}>
            {isPortal ? "Nome completo *" : "Nome *"}
          </FieldLabel>
          <Input
            id={id("nome")}
            autoComplete="name"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.nome)}
            value={values.nome}
            onChange={(event) => update("nome", event.target.value)}
          />
          <FieldError>{errors.nome}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.email) || undefined}>
          <FieldLabel htmlFor={id("email")}>E-mail *</FieldLabel>
          <Input
            id={id("email")}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            aria-invalid={Boolean(errors.email)}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        {isPortal ? (
          <>
            <Field data-invalid={Boolean(errors.telefone) || undefined}>
              <FieldLabel htmlFor={id("telefone")}>Telefone / WhatsApp</FieldLabel>
              <Input
                id={id("telefone")}
                type="tel"
                autoComplete="tel"
                placeholder="(67) 99999-9999"
                value={values.telefone}
                onChange={(event) => update("telefone", event.target.value)}
              />
              <FieldError>{errors.telefone}</FieldError>
            </Field>
            <Field data-invalid={Boolean(errors.assunto) || undefined}>
              <FieldLabel htmlFor={id("assunto")}>Assunto *</FieldLabel>
              <NativeSelect
                id={id("assunto")}
                className="w-full"
                aria-invalid={Boolean(errors.assunto)}
                value={values.assunto}
                onChange={(event) => update("assunto", event.target.value)}
              >
                <NativeSelectOption value="">Selecione um assunto</NativeSelectOption>
                {contatoAssuntos.map((assunto) => (
                  <NativeSelectOption key={assunto} value={assunto}>
                    {contatoAssuntoLabel[assunto]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <FieldError>{errors.assunto}</FieldError>
            </Field>
          </>
        ) : (
          <Field
            className="sm:col-span-2"
            data-invalid={Boolean(errors.assunto) || undefined}
          >
            <FieldLabel htmlFor={id("assunto")}>Assunto *</FieldLabel>
            <Input
              id={id("assunto")}
              placeholder="Assunto"
              aria-invalid={Boolean(errors.assunto)}
              value={values.assunto}
              onChange={(event) => update("assunto", event.target.value)}
            />
            <FieldError>{errors.assunto}</FieldError>
          </Field>
        )}

        <Field
          className="sm:col-span-2"
          data-invalid={Boolean(errors.mensagem) || undefined}
        >
          <FieldLabel htmlFor={id("mensagem")}>Mensagem *</FieldLabel>
          <Textarea
            id={id("mensagem")}
            className="min-h-36"
            placeholder={
              isPortal ? "Escreva sua mensagem aqui..." : "Escreva sua mensagem..."
            }
            aria-invalid={Boolean(errors.mensagem)}
            value={values.mensagem}
            onChange={(event) => update("mensagem", event.target.value)}
          />
          <FieldError>{errors.mensagem}</FieldError>
        </Field>
        <Field
          orientation="horizontal"
          className="sm:col-span-2"
          data-invalid={Boolean(errors.autorizacao) || undefined}
        >
          <Checkbox
            id={id("autorizacao")}
            checked={values.autorizacao}
            aria-invalid={Boolean(errors.autorizacao)}
            onCheckedChange={(checked) => update("autorizacao", checked === true)}
          />
          <FieldLabel htmlFor={id("autorizacao")} className="font-normal">
            Autorizo o uso dos meus dados para contato e retorno da mensagem.
          </FieldLabel>
        </Field>
        <FieldError className="sm:col-span-2">{errors.autorizacao}</FieldError>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={pending}>
            <Send />
            {pending ? "Enviando..." : "Enviar mensagem"}
          </Button>
          {isPortal ? (
            <Button type="button" variant="outline" onClick={reset} disabled={pending}>
              <RotateCcw />
              Limpar formulário
            </Button>
          ) : null}
        </div>
        <div aria-live="polite" className="sm:col-span-2">
          {status.kind === "sent" ? (
            <Alert>
              <ShieldCheck />
              <AlertTitle>Mensagem enviada</AlertTitle>
              <AlertDescription>
                Recebemos sua mensagem e retornaremos o mais breve possível.
              </AlertDescription>
            </Alert>
          ) : null}
          {status.kind === "error" ? (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Mensagem não enviada</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </FieldGroup>
    </form>
  );
}
