# Banco do Portal Terena

## Aplicar no Supabase do projeto

As migrations são idempotentes (podem rodar de novo). Aplique em ordem, pelo SQL Editor
ou `supabase db push`, **primeiro num ambiente de homologação**:

1. `migrations/20261106120000_correcao_permissoes_cadastros.sql` (se ainda não aplicada)
2. `migrations/20261107120000_configuracao_e_auditoria.sql` (se ainda não aplicada)
3. `migrations/20261126120000_ajustes_relatorio_celeny.sql` — itens 05–27 do relatório

A migration 3 não apaga coluna nem dado. Faça um backup antes mesmo assim.

## Testar localmente (sem tocar no banco do projeto)

As migrations antigas (`20260923…` a `20261021…`) não recriam o banco do zero, porque o
banco real foi criado fora delas. Para um banco local igual ao real, use `schema.sql`:

```bash
supabase start                      # precisa de Docker
DB=postgresql://postgres:postgres@127.0.0.1:54322/postgres
psql "$DB" -f supabase/schema.sql
psql "$DB" -f supabase/migrations/20261106120000_correcao_permissoes_cadastros.sql
psql "$DB" -f supabase/migrations/20261107120000_configuracao_e_auditoria.sql
psql "$DB" -f supabase/migrations/20261126120000_ajustes_relatorio_celeny.sql
```

Crie um usuário local (Studio → Authentication) e coloque a URL/chave locais no
`.env.local`. Depois:

```bash
npm test                                            # testes unitários
TEST_EMAIL=... TEST_PASSWORD=... npm run test:db    # integração (só roda em localhost)
```

O `test:db` recusa qualquer URL que não seja `127.0.0.1`/`localhost` e apaga os
registros `TESTE_` que cria.
