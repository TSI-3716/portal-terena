/**
 * Descrição serializável dos campos de um cadastro. Este arquivo não importa
 * nada do servidor, porque as definições também vão para o formulário (cliente).
 */

export type Option = { value: string; label: string };

type FieldBase = {
  name: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  description?: string;
  placeholder?: string;
  /** Ocupa a largura toda no formulário. */
  wide?: boolean;
};

export type FieldDef =
  | (FieldBase & {
      type: "text" | "email" | "tel" | "textarea" | "date" | "datetime" | "money" | "image";
    })
  | (FieldBase & { type: "boolean"; defaultValue?: boolean })
  | (FieldBase & { type: "select"; options: readonly Option[] })
  | (FieldBase & {
      type: "reference";
      table: string;
      valueColumn: string;
      labelColumn: string;
    });

export type FormValues = Record<string, string>;

export type ResourceFormState = {
  error: string;
  fieldErrors: Record<string, string>;
  values: FormValues;
  attempt: number;
} | null;

/** Converte um valor vindo do banco para o texto exibido no campo. */
export function toFormValue(field: FieldDef, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.type === "boolean") return value ? "on" : "";
  if (field.type === "date") return String(value).slice(0, 10);
  if (field.type === "datetime") return String(value).slice(0, 16);
  if (field.type === "money") return String(value).replace(".", ",");
  return String(value);
}
