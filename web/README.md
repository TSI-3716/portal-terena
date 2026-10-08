# 📌 Portal Terena Web

Aplicação web do **Portal Terena**, desenvolvida com `Next.js`, `React`, `TypeScript` e `Tailwind CSS`.

O projeto disponibiliza conteúdos sobre o povo Terena, com páginas de **aldeias**, **cultura**, **juventude**, **notícias**, **projetos** e a seção da **Aldeia Inamaty Kaxe**.

## ✅ Requisitos

Antes de começar, tenha instalado na sua máquina:

- `Node.js` 20 ou superior
- `npm` 10 ou superior

Para conferir as versões instaladas:

```bash
node -v
npm -v
```

## 📦 Instalação

1. Entre na pasta do projeto:

```bash
cd web
```

2. Instale as dependências:

```bash
npm install
```

## 🚀 Como rodar em desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

Depois, abra no navegador:

[`http://localhost:3000`](http://localhost:3000)

O projeto recarrega automaticamente conforme os arquivos são alterados.

## 🧾 Scripts disponíveis

- `npm run dev`: inicia o ambiente de desenvolvimento
- `npm run build`: gera a versão de produção
- `npm run start`: inicia a aplicação em modo produção
- `npm run lint`: executa a validação com ESLint

## 🏗️ Build de produção

Para testar a aplicação em modo de produção localmente:

```bash
npm run build
npm run start
```

## 🗂️ Estrutura principal

Principais pastas e arquivos:

- `src/app`: rotas e páginas da aplicação
- `src/components`: componentes reutilizáveis da interface
- `src/lib`: utilitários, navegação e cliente do Supabase
- `src/app/globals.css`: estilos globais
- `components.json`: configuração do `shadcn/ui`

## 🗺️ Principais rotas

O portal possui páginas como:

- `/`
- `/aldeias`
- `/cultura`
- `/juventude`
- `/noticias`
- `/projetos`
- `/feira`
- `/contato`
- `/login`
- `/conta`
- `/aldeias/inamaty-kaxe`

## 🔐 Variáveis de ambiente

As credenciais reais ficam no arquivo `.env.local`, que **não sobe para o GitHub**.

1. Copie o exemplo:

```bash
cp .env.example .env.local
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env.local
```

2. Preencha com os dados do seu projeto no [Supabase](https://supabase.com/dashboard):

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave `anon` / `publishable` (pública, mas mesmo assim não deve ir para o Git)

Essas duas chaves são as que o Auth do Supabase já oferece. **Não use a `service_role` no frontend.**

## 🔑 Login com Supabase

O login é só **e-mail e senha**, usando o Auth nativo do Supabase. Não há criação de conta neste site: o usuário precisa já existir no painel do Supabase.

1. No painel do Supabase, abra **Authentication → Users** e crie um usuário de teste, se ainda não existir.
2. Rode o projeto e abra [`http://localhost:3000/login`](http://localhost:3000/login).
3. Entre com o e-mail e a senha desse usuário.
4. Se der certo, você cai em `/conta` com a sessão ativa.

## 🧩 Stack utilizada

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `ESLint`
- `shadcn/ui`

## 🔗 Referências

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do React](https://react.dev/)