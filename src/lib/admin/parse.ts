import type { FieldDef, FormValues } from "@/lib/admin/fields";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParseResult = {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  values: FormValues;
};

function lower(label: string) {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

/**
 * Valida e converte o FormData de acordo com as definições de campo.
 * Campos de imagem são tratados à parte (upload para o Storage).
 */
export function parseFormData(fields: readonly FieldDef[], formData: FormData): ParseResult {
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  const values: FormValues = {};

  for (const field of fields) {
    if (field.type === "image") continue;

    const raw = formData.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";
    values[field.name] = text;

    if (field.type === "boolean") {
      data[field.name] = text === "on" || text === "true";
      continue;
    }

    if (!text) {
      if (field.required) {
        errors[field.name] =
          field.type === "select" || field.type === "reference"
            ? `Selecione ${lower(field.label)}`
            : `Informe ${lower(field.label)}`;
      } else {
        data[field.name] = null;
      }
      continue;
    }

    if (field.maxLength && text.length > field.maxLength) {
      errors[field.name] = `Use no máximo ${field.maxLength} caracteres`;
      continue;
    }

    switch (field.type) {
      case "email":
        if (!EMAIL.test(text)) errors[field.name] = "Informe um e-mail válido";
        else data[field.name] = text;
        break;
      case "date":
        if (!DATE.test(text)) errors[field.name] = "Informe uma data válida";
        else data[field.name] = text;
        break;
      case "datetime":
        if (!DATETIME.test(text)) errors[field.name] = "Informe data e hora válidas";
        else data[field.name] = text;
        break;
      case "money": {
        const normalized = text.includes(",")
          ? text.replace(/\./g, "").replace(",", ".")
          : text;
        const amount = Number(normalized.replace(/[^\d.-]/g, ""));
        if (!Number.isFinite(amount) || amount < 0 || amount >= 1e10) {
          errors[field.name] = "Informe um valor válido, por exemplo 120,50";
        } else {
          data[field.name] = Math.round(amount * 100) / 100;
        }
        break;
      }
      case "select":
        if (!field.options.some((option) => option.value === text)) {
          errors[field.name] = `Selecione ${lower(field.label)}`;
        } else {
          data[field.name] = text;
        }
        break;
      case "reference": {
        const id = Number(text);
        if (!Number.isInteger(id) || id <= 0) {
          errors[field.name] = `Selecione ${lower(field.label)}`;
        } else {
          data[field.name] = id;
        }
        break;
      }
      default:
        data[field.name] = text;
    }
  }

  return { data, errors, values };
}
