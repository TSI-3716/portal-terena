// Teste de integração do banco (RLS, N:N notícia-aldeia, exclusões, Cultura,
// galeria). Roda SOMENTE contra o Supabase local (supabase start): recusa
// qualquer URL que não seja localhost. Cria registros com prefixo "TESTE_" e
// apaga todos no final, mesmo se algo falhar.
//
//   TEST_EMAIL=... TEST_PASSWORD=... npm run test:db
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const { hostname } = new URL(url);
if (!["127.0.0.1", "localhost"].includes(hostname)) {
  console.error(`Recusado: ${url} não é o Supabase local.`);
  process.exit(1);
}
if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
  console.error("Defina TEST_EMAIL e TEST_PASSWORD (usuário do Supabase local).");
  process.exit(1);
}

const anon = createClient(url, key, { auth: { persistSession: false } });
const admin = createClient(url, key, { auth: { persistSession: false } });
const PREFIXO = "TESTE_";
let falhas = 0;

async function caso(nome, fn) {
  try {
    await fn();
    console.log(`  ok  ${nome}`);
  } catch (error) {
    falhas += 1;
    console.error(`  FALHOU  ${nome}\n         ${error.message}`);
  }
}

function ok({ data, error }) {
  if (error) throw new Error(`${error.code ?? ""} ${error.message}`);
  return data;
}

async function limpar() {
  const like = `${PREFIXO}%`;
  ok(await admin.from("noticia").delete().like("titulo", like));
  ok(await admin.from("conteudo_aldeia").delete().like("titulo", like));
  ok(await admin.from("artesanato").delete().like("nome", like));
  ok(await admin.from("aldeia").delete().like("nome", like));
  ok(await admin.from("imagem_galeria").delete().like("caminho", `${like}`));
}

const { error: loginError } = await admin.auth.signInWithPassword({
  email: process.env.TEST_EMAIL,
  password: process.env.TEST_PASSWORD,
});
if (loginError) {
  console.error("Login falhou:", loginError.message);
  process.exit(1);
}
const { data: { user } } = await admin.auth.getUser();

try {
  await limpar();
  const [a1, a2] = ok(
    await admin
      .from("aldeia")
      .insert([
        { nome: `${PREFIXO}Aldeia Um`, fonte: "https://exemplo.org/um" },
        { nome: `${PREFIXO}Aldeia Dois` },
      ])
      .select("id_aldeia, criado_em, atualizado_em, fonte"),
  );

  await caso("aldeia grava fonte e datas automáticas (itens 07/08)", async () => {
    assert.equal(a1.fonte, "https://exemplo.org/um");
    assert.ok(a1.criado_em && a1.atualizado_em);
  });

  const geral = ok(
    await admin
      .from("noticia")
      .insert({
        titulo: `${PREFIXO}Notícia geral`,
        resumo: "Notícia sobre o povo Terena",
        conteudo: "Conteúdo completo",
        data_publicacao: "2026-11-20",
        status: "publicado",
        fonte: "https://acritica.net/politica/x",
        id_usuario: user.id,
      })
      .select("id_noticia, data_publicacao")
      .single(),
  );
  const dupla = ok(
    await admin
      .from("noticia")
      .insert({
        titulo: `${PREFIXO}Notícia de duas aldeias`,
        resumo: "Ocorrência nas duas aldeias",
        conteudo: "Conteúdo completo",
        data_publicacao: "2026-11-21",
        status: "publicado",
        id_aldeia: a1.id_aldeia,
        id_usuario: user.id,
      })
      .select("id_noticia")
      .single(),
  );
  ok(
    await admin.from("noticia_aldeia").insert([
      { id_noticia: dupla.id_noticia, id_aldeia: a1.id_aldeia },
      { id_noticia: dupla.id_noticia, id_aldeia: a2.id_aldeia },
    ]),
  );

  await caso("notícia sem aldeia é aceita e aparece no portal (item 13)", async () => {
    const row = ok(
      await anon.from("noticia").select("id_noticia, fonte").eq("id_noticia", geral.id_noticia).maybeSingle(),
    );
    assert.equal(row?.fonte, "https://acritica.net/politica/x");
  });

  await caso("data de publicação volta igual na edição (item 07)", async () => {
    assert.equal(String(geral.data_publicacao).slice(0, 10), "2026-11-20");
    ok(await admin.from("noticia").update({ resumo: "Resumo alterado aqui" }).eq("id_noticia", geral.id_noticia));
    const row = ok(await admin.from("noticia").select("data_publicacao").eq("id_noticia", geral.id_noticia).single());
    assert.equal(String(row.data_publicacao).slice(0, 10), "2026-11-20");
  });

  await caso("notícia com duas aldeias e filtro por aldeia (consulta do app)", async () => {
    const rows = ok(
      await anon
        .from("noticia")
        .select("id_noticia, noticia_aldeia(aldeia(id_aldeia, nome)), filtro:noticia_aldeia!inner(id_aldeia)")
        .eq("filtro.id_aldeia", a2.id_aldeia),
    );
    assert.deepEqual(rows.map((row) => row.id_noticia), [dupla.id_noticia]);
    assert.equal(rows[0].noticia_aldeia.length, 2);
  });

  await caso("visitante não grava em noticia_aldeia (RLS)", async () => {
    const { error } = await anon.from("noticia_aldeia").insert({ id_noticia: geral.id_noticia, id_aldeia: a1.id_aldeia });
    assert.ok(error, "insert anônimo deveria falhar");
  });

  await caso("excluir aldeia não apaga a notícia e some das opções (itens 06/12)", async () => {
    const apagadas = ok(await admin.from("aldeia").delete().eq("id_aldeia", a1.id_aldeia).select("id_aldeia"));
    assert.equal(apagadas.length, 1);
    const noticia = ok(
      await admin.from("noticia").select("id_aldeia, noticia_aldeia(id_aldeia)").eq("id_noticia", dupla.id_noticia).single(),
    );
    assert.equal(noticia.id_aldeia, null);
    assert.deepEqual(noticia.noticia_aldeia.map((link) => link.id_aldeia), [a2.id_aldeia]);
    const opcoes = ok(await admin.from("aldeia").select("id_aldeia").eq("id_aldeia", a1.id_aldeia));
    assert.equal(opcoes.length, 0);
  });

  await caso("exclusão sem permissão não é sucesso silencioso", async () => {
    const apagadas = ok(await anon.from("aldeia").delete().eq("id_aldeia", a2.id_aldeia).select("id_aldeia"));
    assert.equal(apagadas.length, 0);
    const ainda = ok(await admin.from("aldeia").select("id_aldeia").eq("id_aldeia", a2.id_aldeia));
    assert.equal(ainda.length, 1);
  });

  await caso("Cultura tem as cinco categorias (itens 15/16)", async () => {
    const cultura = ok(await anon.from("tipo_conteudo").select("id_tipo").eq("slug", "cultura").single());
    const filhos = ok(
      await anon.from("tipo_conteudo").select("slug").eq("id_tipo_pai", cultura.id_tipo).order("ordem"),
    );
    assert.deepEqual(
      filhos.map((tipo) => tipo.slug),
      ["memoria-viva", "historia-terena", "lingua-terena", "tradicoes-e-saberes", "calendario-cultural"],
    );
    const juventude = ok(await anon.from("tipo_conteudo").select("id_tipo").eq("slug", "juventude"));
    assert.equal(juventude.length, 1);
  });

  await caso("conteúdo da Cultura: rascunho oculto, publicado visível, sem aldeia", async () => {
    const lingua = ok(await anon.from("tipo_conteudo").select("id_tipo").eq("slug", "lingua-terena").single());
    const [rascunho, publicado] = ok(
      await admin
        .from("conteudo_aldeia")
        .insert([
          { titulo: `${PREFIXO}Rascunho`, id_tipo: lingua.id_tipo, status: "rascunho", resumo: "r", descricao: "d" },
          { titulo: `${PREFIXO}Publicado`, id_tipo: lingua.id_tipo, status: "publicado", resumo: "r", descricao: "d", fonte: "Ancião" },
        ])
        .select("id_conteudo"),
    );
    const visiveis = ok(
      await anon.from("conteudo_aldeia").select("id_conteudo").in("id_conteudo", [rascunho.id_conteudo, publicado.id_conteudo]),
    );
    assert.deepEqual(visiveis.map((row) => row.id_conteudo), [publicado.id_conteudo]);
  });

  await caso("artesanato salva sem preço/disponibilidade e aparece no portal (item 24)", async () => {
    const peca = ok(
      await admin
        .from("artesanato")
        .insert({ nome: `${PREFIXO}Peça`, descricao: "Peça de teste", categoria: "Cerâmica", fonte: "Artesã" })
        .select("id_artesanato")
        .single(),
    );
    const visivel = ok(await anon.from("artesanato").select("id_artesanato").eq("id_artesanato", peca.id_artesanato));
    assert.equal(visivel.length, 1);

    ok(
      await admin.from("imagem_galeria").insert([
        { entidade: "artesanato", id_registro: String(peca.id_artesanato), caminho: `${PREFIXO}a.webp`, ordem: 1 },
        { entidade: "artesanato", id_registro: String(peca.id_artesanato), caminho: `${PREFIXO}b.webp`, ordem: 2 },
      ]),
    );
    const galeria = ok(
      await anon.from("imagem_galeria").select("id").eq("entidade", "artesanato").eq("id_registro", String(peca.id_artesanato)),
    );
    assert.equal(galeria.length, 2, "galeria com várias imagens (item 25)");

    ok(await admin.from("artesanato").delete().eq("id_artesanato", peca.id_artesanato));
    const sobrou = ok(
      await admin.from("imagem_galeria").select("id").eq("entidade", "artesanato").eq("id_registro", String(peca.id_artesanato)),
    );
    assert.equal(sobrou.length, 0, "galeria apagada junto com o registro");
  });
} finally {
  await limpar();
  const restos = await Promise.all([
    admin.from("noticia").select("id_noticia", { count: "exact", head: true }).like("titulo", `${PREFIXO}%`),
    admin.from("aldeia").select("id_aldeia", { count: "exact", head: true }).like("nome", `${PREFIXO}%`),
    admin.from("conteudo_aldeia").select("id_conteudo", { count: "exact", head: true }).like("titulo", `${PREFIXO}%`),
    admin.from("artesanato").select("id_artesanato", { count: "exact", head: true }).like("nome", `${PREFIXO}%`),
  ]);
  const total = restos.reduce((soma, r) => soma + (r.count ?? 0), 0);
  console.log(total === 0 ? "  ok  dados de teste removidos" : `  FALHOU  sobraram ${total} registros de teste`);
  if (total !== 0) falhas += 1;
  await admin.auth.signOut();
}

console.log(falhas === 0 ? "\nTodos os testes de banco passaram." : `\n${falhas} teste(s) falharam.`);
process.exit(falhas === 0 ? 0 : 1);
