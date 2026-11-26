import type { NextConfig } from "next";

function supabaseStorage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  try {
    const parsed = new URL(url);
    // http só no Supabase local (supabase start); produção usa https.
    const protocol = parsed.protocol === "http:" ? ("http" as const) : ("https" as const);
    return { hostname: parsed.hostname, port: parsed.port, protocol };
  } catch {
    return null;
  }
}

const storage = supabaseStorage();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    // Supabase local roda em 127.0.0.1, que o otimizador bloqueia por padrão.
    dangerouslyAllowLocalIP: storage?.hostname === "127.0.0.1" || storage?.hostname === "localhost",
    remotePatterns: storage
      ? [
          {
            protocol: storage.protocol,
            hostname: storage.hostname,
            port: storage.port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
