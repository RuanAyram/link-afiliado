# PRD — Landing Page de Links de Afiliado

**Versão:** 1.0  
**Status:** Draft  
**Última atualização:** 2026-05-25

---

## 1. Visão Geral

Uma landing page pública que exibe produtos de plataformas de afiliado (Shopee, Amazon, Mercado Livre, etc.) em formato de vitrine, com cards em grid. Os produtos são cadastrados diretamente no banco de dados via N8N e ficam disponíveis imediatamente no front-end, sem necessidade de redeploy. A imagem de cada produto é extraída automaticamente via Open Graph a partir da URL do afiliado.

---

## 2. Objetivos

- Centralizar links de afiliado em uma única página pública e navegável
- Eliminar fricção no cadastro: inserir no banco → aparece no site
- Maximizar conversão com layout visual atraente e otimizado para mobile
- Ser facilmente indexável via SEO

---

## 3. Personas

| Persona | Descrição |
|---|---|
| **Visitante** | Usuário que chega pelo link, navega pelos produtos e clica no afiliado |
| **Curador (você)** | Insere novos produtos via N8N + NeonDB. Não acessa o front diretamente para gerenciar |

---

## 4. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework front-end | Next.js (App Router) + React |
| Banco de dados | NeonDB (PostgreSQL serverless) |
| ORM / Query | `@neondatabase/serverless` ou `drizzle-orm` |
| Inserção de dados | N8N → NeonDB via HTTP/API do Neon |
| Imagens | Open Graph scraping via API Route do Next.js |
| Deploy | Vercel (recomendado — integração nativa com Next.js e variáveis de ambiente) |
| SEO | Next.js Metadata API (`generateMetadata`) |
| Estilização | Tailwind CSS |

---

## 5. Schema do Banco de Dados

```sql
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,             -- link de afiliado
  category    TEXT,                      -- ex: "Eletrônicos", "Casa", "Moda"
  origin      TEXT,                      -- ex: "shopee", "amazon", "mercadolivre"
  image_url   TEXT,                      -- preenchido manualmente OU via OG scraping
  price       NUMERIC(10,2),             -- opcional, para exibir no card
  description TEXT,                      -- opcional, subtítulo do card
  active      BOOLEAN DEFAULT TRUE,      -- para ocultar sem deletar
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

> **Nota:** O campo `image_url` pode ser deixado vazio no momento da inserção. A API Route do Next.js tenta buscar via Open Graph da `url` quando `image_url` é nulo.

---

## 6. Funcionalidades

### 6.1 Página Principal (`/`)

- Grid responsivo de cards de produtos (mobile: 2 colunas, tablet: 3, desktop: 4)
- Cada card exibe: imagem, título, origem (badge/logo), categoria e preço (se disponível)
- Clique no card abre o link de afiliado em nova aba
- Filtro por categoria (chips horizontais com scroll, fixo no topo em mobile)
- Filtro por origem (Shopee, Amazon, Mercado Livre)
- Busca simples por título (client-side ou server-side)
- Ordenação: mais recentes primeiro (padrão)

### 6.2 API Route — Open Graph Scraping (`/api/og?url=...`)

- Recebe uma URL de afiliado como query param
- Faz fetch da página e extrai `og:image`, `og:title`, `og:description`
- Retorna JSON com os dados extraídos
- Cacheada com `revalidate` para não repetir scraping desnecessário
- Usada pelo front ao renderizar cards sem `image_url`

### 6.3 Atualização em Tempo Real

- O front usa `revalidatePath` (Next.js) ou polling leve (SWR com `refreshInterval`) para refletir novos produtos
- Alternativa recomendada: ao inserir via N8N, chamar também um webhook do Next.js (`/api/revalidate`) para invalidar o cache da página imediatamente

### 6.4 SEO

- `<title>` e `<meta description>` configurados via `generateMetadata`
- `og:image` estática ou gerada com `ImageResponse` (OG dinâmico)
- Sitemap automático via `sitemap.ts`
- `robots.txt` permissivo
- URLs amigáveis e semânticas

---

## 7. Fluxo de Dados

```
Você (curador)
    │
    ▼
  N8N Workflow
    │  (INSERT INTO products ...)
    ▼
  NeonDB
    │
    ├──► Next.js chama /api/revalidate  ──► Cache invalidado
    │
    ▼
  Next.js (Server Components)
    │  (SELECT * FROM products WHERE active = true)
    ▼
  Landing Page atualizada para o visitante
```

---

## 8. Requisitos Não-Funcionais

| Requisito | Detalhe |
|---|---|
| **Mobile-first** | Layout 100% funcional e bonito em telas a partir de 375px |
| **Performance** | Imagens com `next/image` + lazy loading; Core Web Vitals no verde |
| **Segurança** | Sem autenticação pública; credenciais do banco apenas em `.env` (nunca expostas no front) |
| **Disponibilidade** | Leitura do banco é read-only no front; sem risco de escrita não-autorizada |
| **Escalabilidade** | NeonDB serverless suporta cold starts; sem necessidade de gerenciar conexões |

---

## 9. Variáveis de Ambiente

```env
# NeonDB
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require

# Revalidação de cache (token secreto para o webhook)
REVALIDATE_SECRET=seu_token_secreto_aqui
```

---

## 10. Estrutura de Pastas Sugerida

```
/
├── app/
│   ├── page.tsx                  # Página principal (Server Component)
│   ├── layout.tsx                # Layout global + metadata base
│   ├── sitemap.ts                # Sitemap dinâmico
│   ├── robots.ts
│   └── api/
│       ├── og/route.ts           # Scraping de Open Graph
│       └── revalidate/route.ts   # Webhook de revalidação (chamado pelo N8N)
├── components/
│   ├── ProductCard.tsx
│   ├── CategoryFilter.tsx
│   ├── OriginBadge.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── db.ts                     # Conexão com NeonDB
│   └── og.ts                     # Helper de scraping OG
├── public/
│   └── logos/                    # Logos Shopee, Amazon, Mercado Livre
├── .env.local
└── next.config.ts
```

---

## 11. Fora do Escopo (v1)

- Painel administrativo / CMS visual
- Autenticação de qualquer tipo
- Histórico de cliques / analytics próprio
- Comparação de preços
- Notificações de novos produtos

---

## 12. Decisões em Aberto

| Decisão | Opções | Recomendação |
|---|---|---|
| Nome / identidade visual | Em aberto | Definir antes do desenvolvimento do front |
| Estratégia de imagem quando OG falha | Placeholder genérico por categoria ou logo da origem | Placeholder por categoria (mais visual) |
| Polling vs webhook de revalidação | SWR polling (simples) vs `/api/revalidate` via N8N (instantâneo) | Webhook via N8N para melhor UX |
| Preço e descrição | Opcionais no schema | Exibir no card somente se preenchidos |

---

## 13. Critérios de Aceite (MVP)

- [ ] Grid de produtos renderiza corretamente em mobile e desktop
- [ ] Produto inserido no NeonDB aparece na página em até 60 segundos
- [ ] Imagens são extraídas automaticamente via Open Graph
- [ ] Filtro por categoria funciona sem recarregar a página
- [ ] Clique no card redireciona para o link de afiliado em nova aba
- [ ] Página tem title, description e og:image configurados
- [ ] Variáveis sensíveis nunca expostas no bundle do cliente
