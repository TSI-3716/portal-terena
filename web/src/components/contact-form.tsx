"use client";

import { useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
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
import { contatoSchema } from "@/lib/schemas";

const initialValues = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "",
  mensagem: "",
  autorizacao: false,
};

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = contatoSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setSent(false);
      return;
    }

    setErrors({});
    setSent(true);
  }

  return (
    <form className="mt-4" onSubmit={onSubmit}>
      <FieldGroup className="gap-4 sm:grid sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.nome) || undefined}>
          <FieldLabel htmlFor="nome">Nome completo *</FieldLabel>
          <Input
            id="nome"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.nome)}
            value={values.nome}
            onChange={(event) =>
              setValues((current) => ({ ...current, nome: event.target.value }))
            }
          />
          <FieldError>{errors.nome}</FieldError>
        </Field>
        <Field data-invalid={Boolean(errors.email) || undefined}>
          <FieldLabel htmlFor="email">E-mail *</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            aria-invalid={Boolean(errors.email)}
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
          />
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="telefone">Telefone / WhatsApp</FieldLabel>
          <Input
            id="telefone"
            placeholder="(67) 99999-9999"
            value={values.telefone}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                telefone: event.target.value,
              }))
            }
          />
        </Field>
        <Field data-invalid={Boolean(errors.assunto) || undefined}>
          <FieldLabel htmlFor="assunto">Assunto *</FieldLabel>
          <NativeSelect
            id="assunto"
            className="w-full"
            aria-invalid={Boolean(errors.assunto)}
            value={values.assunto}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                assunto: event.target.value,
              }))
            }
          >
            <NativeSelectOption value="">Selecione um assunto</NativeSelectOption>
            <NativeSelectOption value="informacoes">Informações</NativeSelectOption>
            <NativeSelectOption value="parcerias">
              Parcerias e Projetos
            </NativeSelectOption>
            <NativeSelectOption value="imprensa">Imprensa</NativeSelectOption>
          </NativeSelect>
          <FieldError>{errors.assunto}</FieldError>
        </Field>
        <Field
          className="sm:col-span-2"
          data-invalid={Boolean(errors.mensagem) || undefined}
        >
          <FieldLabel htmlFor="mensagem">Mensagem *</FieldLabel>
          <Textarea
            id="mensagem"
            className="min-h-36"
            placeholder="Escreva sua mensagem aqui..."
            aria-invalid={Boolean(errors.mensagem)}
            value={values.mensagem}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                mensagem: event.target.value,
              }))
            }
          />
          <FieldError>{errors.mensagem}</FieldError>
        </Field>
        <Field
          orientation="horizontal"
          className="sm:col-span-2"
          data-invalid={Boolean(errors.autorizacao) || undefined}
        >
          <Checkbox
            id="autorizacao"
            checked={values.autorizacao}
            onCheckedChange={(checked) =>
              setValues((current) => ({
                ...current,
                autorizacao: checked === true,
              }))
            }
          />
          <FieldLabel htmlFor="autorizacao" className="font-normal">
            Autorizo o uso dos meus dados para contato e retorno da mensagem.
          </FieldLabel>
        </Field>
        <FieldError className="sm:col-span-2">{errors.autorizacao}</FieldError>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit">Enviar mensagem</Button>
          <Button
            type="reset"
            variant="outline"
            onClick={() => {
              setValues(initialValues);
              setErrors({});
              setSent(false);
            }}
          >
            Limpar formulário
          </Button>
        </div>
        {sent ? (
          <Alert className="sm:col-span-2">
            <ShieldCheck />
            <AlertTitle>Mensagem validada</AlertTitle>
            <AlertDescription>
              O envio ainda não está conectado a um serviço.
            </AlertDescription>
          </Alert>
        ) : null}
      </FieldGroup>
    </form>
  );
}
