"use server";

import { revalidatePath } from "next/cache";
import { criarMensagemContato } from "@/lib/contato";
import {
  contatoAldeiaSchema,
  contatoSchema,
  fieldErrorsFrom,
} from "@/lib/schemas";

export type EnvioContatoResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const FALHA_ENVIO =
  "Não foi possível enviar sua mensagem agora. Tente novamente em alguns minutos.";

/** Campo-armadilha: humanos não o veem; robôs costumam preenchê-lo. */
function isBot(input: unknown) {
  return (
    typeof input === "object" &&
    input !== null &&
    "website" in input &&
    typeof input.website === "string" &&
    input.website.trim() !== ""
  );
}

export async function enviarContatoPortal(
  input: unknown,
): Promise<EnvioContatoResult> {
  if (isBot(input)) return { ok: true };

  const parsed = contatoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Verifique os campos destacados.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  try {
    await criarMensagemContato({ origem: "portal", ...parsed.data });
  } catch {
    return { ok: false, message: FALHA_ENVIO };
  }

  revalidatePath("/admin/mensagens");
  return { ok: true };
}

export async function enviarContatoAldeia(
  input: unknown,
): Promise<EnvioContatoResult> {
  if (isBot(input)) return { ok: true };

  const parsed = contatoAldeiaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Verifique os campos destacados.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  try {
    await criarMensagemContato({ origem: "inamaty-kaxe", ...parsed.data });
  } catch {
    return { ok: false, message: FALHA_ENVIO };
  }

  revalidatePath("/admin/mensagens");
  return { ok: true };
}
