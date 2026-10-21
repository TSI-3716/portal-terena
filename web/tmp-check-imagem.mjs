import fs from "node:fs";

const text = fs.readFileSync(new URL("./.env.local", import.meta.url), "utf8");
const env = {};
for (const line of text.split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) continue;
  env[match[1]] = match[2].replace(/^["']|["']$/g, "");
}

const base = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}` };

const list = await fetch(
  `${base}/rest/v1/noticia?select=id_noticia,titulo,status,imagem&order=id_noticia.desc&limit=5`,
  { headers },
);
console.log("list", list.status, await list.text());

const bucket = await fetch(`${base}/storage/v1/bucket/assets`, { headers });
console.log("bucket", bucket.status, (await bucket.text()).slice(0, 200));

const pub = await fetch(
  `${base}/storage/v1/object/public/assets/noticias/3426f431-91cb-446b-955e-810149773412.webp`,
  { method: "HEAD" },
);
console.log("public", pub.status, pub.headers.get("content-type"));

const objects = await fetch(
  `${base}/storage/v1/object/list/assets`,
  {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "noticias", limit: 10 }),
  },
);
console.log("objects", objects.status, (await objects.text()).slice(0, 400));
