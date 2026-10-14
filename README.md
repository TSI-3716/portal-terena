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
- `/aldeias/inamaty-kaxe` (e as subpáginas `sobre`, `historia`, `anciaos`, `cultura`, `noticias`, `projetos`, `juventude`, `artesanato`, `eventos`, `localizacao`, `galeria`, `contato`)
- `/aldeias/[id]` (página de cada aldeia cadastrada)
- `/admin` e os cadastros em `/admin/[recurso]` (área restrita)

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

## 🗄️ Banco de dados

O esquema de referência está em `supabase/schema.sql` (tabelas `aldeia`, `contato_aldeia`, `evento`, `noticia`, `projeto`, `artesanato`, `tipo_conteudo` e `mensagem_contato`). As tabelas já devem existir no projeto Supabase.

As migrations em `supabase/migrations` complementam o esquema:

- `20261009120000_politicas_portal.sql`: RLS e permissões (visitantes leem o conteúdo público e só veem notícias publicadas; usuários logados administram tudo), bucket público `assets` e políticas do Storage
- `20261009120100_conteudo_inicial.sql`: carrega o conteúdo do protótipo (aldeias, contato da Inamaty Kaxé, eventos, projetos, artesanato e tipos de conteúdo); não duplica nada se rodar de novo

Com a CLI do Supabase (projeto já vinculado):

```bash
npx supabase db push
```

Ou cole o conteúdo de cada arquivo, em ordem, no **SQL Editor** do painel.

### Autor das notícias (`usuario`)

`noticia.id_usuario` aponta para a tabela `public.usuario`, que não faz parte do esquema acima. O painel descobre o `id_usuario` comparando o **e-mail do login** (Supabase Auth) com a coluna `email` de `usuario`. Para publicar, cada pessoa que entra no painel precisa ter um registro em `usuario` com o mesmo e-mail. Se a coluna tiver outro nome, ajuste `src/lib/usuario.ts`.

Toda notícia também exige uma **aldeia** e um **evento** relacionados (`id_aldeia` e `id_evento` são obrigatórios no esquema).

### Imagens

A coluna `imagem` aceita três formatos: caminho no bucket `assets` (o que o painel grava no upload), caminho começando com `/` para arquivos de `public/` (usado pelo conteúdo inicial, por exemplo `/images/aldeias_1.jpg`) ou URL completa do próprio Supabase Storage.

## 🛠️ Painel administrativo

Em `/admin`, com login, há cadastros para notícias, aldeias, contatos das aldeias, eventos, projetos, artesanato e tipos de conteúdo, além da caixa de mensagens. Os cadastros são gerados a partir de `src/lib/admin/resources.ts`: para incluir um campo ou uma tabela nova, basta descrevê-la ali.

## 📬 Formulários de contato

Os formulários de `/contato` e `/aldeias/inamaty-kaxe/contato` gravam na tabela `mensagem_contato`. Pela RLS, visitantes só conseguem **inserir** (e apenas com a autorização de dados marcada); somente usuários logados leem, marcam como lida e excluem, pelo painel em `/admin/mensagens`.

## 🖼️ Imagens estáticas

As fotos do protótipo HTML (`docs/.../assets`) estão em `public/images` e são referenciadas por `staticImage("nome")` (`src/lib/images.ts`), que só aceita nomes de arquivos existentes.

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