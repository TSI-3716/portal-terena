import { z } from "zod";
import { requireUser } from "@/lib/auth";
import type { ArtesanatoInput } from "@/lib/schemas";
import { createClient } from "@/lib/supabase";

export const ARTESANATO_IMAGE_FOLDER = "artesanato";

/**
 * No banco atual id_artesanato é integer (identity). Uma migration antiga
 * criava uuid, então os dois formatos são aceitos, como em notícias.
 */
export function isArtesanatoId(id: string) {
  return /^[1-9]\d*$/.test(id) || z.uuid().safeParse(id).success;
}

export type Artesanato = ArtesanatoInput & {
  id_artesanato: number | string;
  imagem: string | null;
};

const listColumns =
  "id_artesanato, nome, categoria, preco, imagem, disponivel";

export async function listArtesanatosPublicos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artesanato")
    .select(listColumns)
    .eq("disponivel", true)
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Omit<Artesanato, "descricao">[];
}

export async function getArtesanatoPublico(id: string) {
  if (!isArtesanatoId(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artesanato")
    .select("*")
    .eq("id_artesanato", id)
    .eq("disponivel", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Artesanato | null;
}

export async function listArtesanatosAdmin() {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("artesanato")
    .select(listColumns)
    .order("nome", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Omit<Artesanato, "descricao">[];
}

export async function getArtesanatoAdmin(id: string) {
  if (!isArtesanatoId(id)) return null;

  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("artesanato")
    .select("*")
    .eq("id_artesanato", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Artesanato | null;
}
