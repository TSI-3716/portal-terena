export const ASSETS_BUCKET = "assets";

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
