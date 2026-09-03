"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <form className="form-grid" onSubmit={onSubmit}>
      <div className="form-field">
        <Label htmlFor="nome">Nome completo *</Label>
        <Input
          id="nome"
          className="h-10"
          placeholder="Seu nome"
          value={values.nome}
          onChange={(event) =>
            setValues((current) => ({ ...current, nome: event.target.value }))
          }
        />
        {errors.nome ? <p className="form-error">{errors.nome}</p> : null}
      </div>
      <div className="form-field">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          className="h-10"
          placeholder="seu@email.com"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
        />
        {errors.email ? <p className="form-error">{errors.email}</p> : null}
      </div>
      <div className="form-field">
        <Label htmlFor="telefone">Telefone / WhatsApp</Label>
        <Input
          id="telefone"
          className="h-10"
          placeholder="(67) 99999-9999"
          value={values.telefone}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              telefone: event.target.value,
            }))
          }
        />
      </div>
      <div className="form-field">
        <Label htmlFor="assunto">Assunto *</Label>
        <select
          id="assunto"
          value={values.assunto}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              assunto: event.target.value,
            }))
          }
        >
          <option value="">Selecione um assunto</option>
          <option value="informacoes">Informações</option>
          <option value="parcerias">Parcerias e Projetos</option>
          <option value="imprensa">Imprensa</option>
        </select>
        {errors.assunto ? <p className="form-error">{errors.assunto}</p> : null}
      </div>
      <div className="form-field full">
        <Label htmlFor="mensagem">Mensagem *</Label>
        <Textarea
          id="mensagem"
          className="min-h-[150px]"
          placeholder="Escreva sua mensagem aqui..."
          value={values.mensagem}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              mensagem: event.target.value,
            }))
          }
        />
        {errors.mensagem ? (
          <p className="form-error">{errors.mensagem}</p>
        ) : null}
      </div>
      <div className="form-field full">
        <Label htmlFor="autorizacao" className="font-normal">
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
          Autorizo o uso dos meus dados para contato e retorno da mensagem.
        </Label>
        {errors.autorizacao ? (
          <p className="form-error">{errors.autorizacao}</p>
        ) : null}
      </div>
      <div className="form-field">
        <Button type="submit" className="h-10 px-4">
          Enviar mensagem
        </Button>
      </div>
      <div className="form-field">
        <Button
          type="reset"
          variant="outline"
          className="h-10 px-4"
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
        <div className="form-field full">
          <div className="notice">
            Mensagem validada. O envio ainda não está conectado a um serviço.
          </div>
        </div>
      ) : null}
    </form>
  );
}
