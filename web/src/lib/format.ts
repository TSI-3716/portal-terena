/** Formata "YYYY-MM-DD" ou um timestamp como "12 de maio de 2024". */
export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Formata a data como "25 MAI", igual aos cards de evento do protótipo. */
export function formatDayMonth(value: string | null | undefined) {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;

  const date = new Date(Date.UTC(year, month - 1, day));
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
  return `${String(day).padStart(2, "0")} ${mes}`;
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

/** Data e hora no fuso de Mato Grosso do Sul, ex.: "26/11/2026 09:15". */
export function formatDateTime(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Campo_Grande",
  }).format(date);
}
