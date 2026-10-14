import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Portal Terena",
    template: "%s | Portal Terena",
  },
  description:
    "Conheça a cultura, as aldeias, os projetos, as notícias e as iniciativas do povo Terena.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const account = data.user
    ? { href: "/admin", label: "Administração" }
    : { href: "/login", label: "Entrar" };

  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <Header accountHref={account.href} accountLabel={account.label} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
