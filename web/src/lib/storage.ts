import type { SupabaseClient } from "@supabase/supabase-js";

export const ASSETS_BUCKET = "assets";
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MANAGED_IMAGE_PATH =
  /^[a-z0-9-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(webp|jpe?g|png)$/i;

export function getPublicAssetUrl(
  path: string,
  bucket = ASSETS_BUCKET,
) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não está definida.");
  }

  const cleaned = path.replace(/^\/+/, "");
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${cleaned}`;
}

export function readImageFile(formData: FormData, field = "imagem") {
  const value = formData.get(field);
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

export function validateImageFile(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    return "Envie uma imagem JPG, PNG ou WebP.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "A imagem otimizada passou de 2 MB. Escolha outra foto.";
  }

  return null;
}

export async function uploadImage(
  supabase: SupabaseClient,
  folder: string,
  file: File,
) {
  if (!/^[a-z0-9-]+$/.test(folder)) {
    throw new Error("Pasta de upload inválida.");
  }

  const extension =
    file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    throw new Error("Não foi possível enviar a imagem.");
  }

  return path;
}

export async function removeImage(supabase: SupabaseClient, path: string) {
  const cleaned = path.replace(/^\/+/, "");
  if (!MANAGED_IMAGE_PATH.test(cleaned)) return;

  await supabase.storage.from(ASSETS_BUCKET).remove([cleaned]);
}
