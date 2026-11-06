/**
 * Expressões regulares e normalizações usadas por todos os formulários
 * (contato, cadastros do painel e configurações). Fonte única: não repita
 * regex em outros arquivos.
 */

/** E-mail: usuário@domínio.tld, TLD com 2+ letras, sem espaços. */
export const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

/**
 * Telefone brasileiro, com ou sem máscara e com ou sem +55:
 * (67) 99999-9999 · (67) 3333-4444 · 67999999999 · +55 67 99999-9999 · 0800 123 4567
 */
export const TELEFONE_REGEX =
  /^(?:(?:\+?55[\s-]?)?(?:\(\d{2}\)|\d{2})[\s-]?(?:9\d{4}|[2-8]\d{3})[\s-]?\d{4}|0[358]00[\s-]?\d{3}[\s-]?\d{4})$/;

/** Nome de pessoa: letras (com acento), espaços, ponto, apóstrofo e hífen. */
export const NOME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;

/** Endereço web começando com http:// ou https://. */
export const URL_REGEX = /^https?:\/\/[^\s/$.?#][^\s]*$/i;

export const MENSAGENS = {
  email: "Informe um e-mail válido, por exemplo nome@dominio.com.br",
  telefone: "Informe um telefone válido, por exemplo (67) 99999-9999",
  nome: "Use apenas letras, espaços, ponto, apóstrofo ou hífen",
  url: "Informe um endereço completo, começando com https://",
} as const;

export const isEmail = (value: string) => EMAIL_REGEX.test(value.trim());
export const isTelefone = (value: string) => TELEFONE_REGEX.test(value.trim());
export const isUrl = (value: string) => URL_REGEX.test(value.trim());

/** Padroniza o telefone para (67) 99999-9999 / (67) 3333-4444 / 0800 123 4567. */
export function formatTelefone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (/^0[358]00\d{7}$/.test(digits)) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value.trim();
}

/** Só os dígitos, para links tel: e wa.me. */
export function telefoneDigitos(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? digits : digits.length <= 11 ? `55${digits}` : digits;
}
