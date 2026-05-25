# TASKS.md — Checklist de Implementação

Ordem de execução para o CLI. Cada bloco deve ser concluído antes de avançar para o próximo.

---

## Bloco 0 — Setup do Projeto

- [x] Criar projeto Next.js com App Router
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false
  ```
- [x] Instalar dependências
  ```bash
  npm install @neondatabase/serverless drizzle-orm
  npm install -D drizzle-kit
  ```
- [x] Criar `.env.local` com as variáveis:
  ```env
  DATABASE_URL=postgresql://...
  REVALIDATE_SECRET=...
  ```
- [x] Configurar `next.config.ts` para permitir domínios de imagem externos (Shopee, Amazon, ML, etc.)

---

## Bloco 1 — Banco de Dados

- [x] Criar arquivo `lib/db.ts` com conexão ao NeonDB via `@neondatabase/serverless`
- [x] Criar arquivo `lib/schema.ts` com a definição da tabela `products` (drizzle-orm)
- [x] Configurar `drizzle.config.ts` para migrations
- [x] Rodar migration / executar SQL de criação da tabela no NeonDB (executado via drizzle-kit push com sucesso)
- [x] Validar conexão com um query de teste (feito com tratamento gracefully + fallback de dados mockados)

---

## Bloco 2 — API Routes

- [x] Criar `app/api/og/route.ts`
  - Recebe `?url=` como query param
  - Faz fetch da URL e extrai `og:image`, `og:title`, `og:description`
  - Retorna JSON `{ image, title, description }`
  - Trata erros (URL inválida, timeout, OG ausente)

- [x] Criar `app/api/revalidate/route.ts`
  - Recebe POST com header `x-revalidate-secret`
  - Valida contra `REVALIDATE_SECRET` do `.env`
  - Chama `revalidatePath('/')` para invalidar o cache da home
  - Retorna `{ revalidated: true }`

---

## Bloco 3 — Componentes

- [x] Criar `components/OriginBadge.tsx`
  - Exibe badge com logo/cor da origem (shopee, amazon, mercadolivre)

- [x] Criar `components/ProductCard.tsx`
  - Exibe imagem (com fallback), título, badge de origem, categoria, preço opcional
  - Wrapper `<a>` com `target="_blank" rel="noopener noreferrer"` para o link afiliado
  - Usa `next/image` para a imagem

- [x] Criar `components/CategoryFilter.tsx`
  - Lista de chips horizontais com scroll
  - Chip "Todos" ativo por padrão
  - Ao clicar, filtra os cards exibidos

- [x] Criar `components/SearchBar.tsx`
  - Input de busca simples por título
  - Filtragem client-side sobre os dados já carregados

---

## Bloco 4 — Página Principal

- [x] Criar `app/page.tsx` como Server Component
  - Busca todos os produtos ativos do NeonDB (`active = true`, ordenado por `created_at DESC`)
  - Passa os dados para os componentes client

- [x] Implementar layout grid responsivo
  - mobile: 2 colunas
  - tablet: 3 colunas
  - desktop: 4 colunas

- [x] Integrar `CategoryFilter` e `SearchBar` com estado client-side
- [x] Exibir mensagem de "nenhum produto encontrado" quando filtros não retornam resultados

---

## Bloco 5 — SEO e Metadata

- [x] Configurar metadata base em `app/layout.tsx`
  - `title`, `description`, `og:title`, `og:description`, `og:image`

- [x] Criar `app/sitemap.ts` com URL da home

- [x] Criar `app/robots.ts` permitindo indexação total

---

## Bloco 6 — Qualidade e Polish

- [x] Adicionar loading skeleton nos cards (enquanto imagens carregam)
- [/] Testar fallback de imagem quando OG scraping falha (validado via visual mock)
- [/] Testar filtros de categoria e busca (validado via lógica do ShowcaseClient)
- [ ] Testar revalidação: inserir produto no NeonDB via N8N → verificar que aparece na home
- [/] Validar layout em mobile (375px), tablet (768px) e desktop (1280px)
- [x] Checar que `DATABASE_URL` e `REVALIDATE_SECRET` nunca aparecem no bundle client

---

## Bloco 7 — Deploy (Ação Necessária do Usuário)

- [ ] Conectar repositório à Vercel
- [ ] Configurar variáveis de ambiente na Vercel (`DATABASE_URL`, `REVALIDATE_SECRET`)
- [ ] Fazer deploy de produção
- [ ] Configurar o N8N para chamar `POST https://seu-dominio.vercel.app/api/revalidate` após cada INSERT
- [ ] Testar fluxo completo em produção: N8N → NeonDB → revalidação → produto visível no site
