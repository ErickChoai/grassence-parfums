# Grassence Parfums

E-commerce de decants de perfumaria fina, com sede em Florianópolis/SC. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion, com banco de dados via Prisma, checkout via Mercado Pago e painel administrativo completo.

## Stack

- **Next.js 16** (App Router, Server Actions, Route Handlers)
- **TypeScript** + **Tailwind CSS v4** (tokens de design em `src/app/globals.css`)
- **Framer Motion** para animações (respeitando `prefers-reduced-motion`)
- **Prisma 7** + SQLite (driver adapter `@prisma/adapter-better-sqlite3`) — troque para Postgres em produção
- **Zustand** para o carrinho (persistido em `localStorage`)
- **Mercado Pago SDK** (Checkout Pro) para pagamentos
- **jose** + cookies `httpOnly` para sessão do admin (JWT assinado)
- **Zod** para validação de formulários e payloads de API
- **@phosphor-icons/react** para ícones (sem emojis)

## Funcionalidades

- Home, catálogo com filtros (gênero, marca, família olfativa, busca, ordenação), página de produto com seleção de tamanho/preço
- Carrinho persistente (drawer lateral) e checkout com endereço + Mercado Pago
- Painel admin (`/admin`): dashboard, CRUD de produtos e variantes (tamanho/preço/estoque), gestão de pedidos com atualização de status
- Webhook do Mercado Pago que confirma pagamento e dá baixa automática no estoque
- Páginas institucionais: Sobre, FAQ, Trocas e devoluções, Contato
- Catálogo inicial com 55 perfumes reais (marcas de nicho e design) já semeado no banco

## Primeiros passos

O projeto usa **PostgreSQL**. Para desenvolver localmente você pode criar um banco gratuito na nuvem (Neon ou Supabase) e usar a mesma connection string, ou rodar um Postgres local.

```bash
npm install
cp .env.example .env      # cole sua DATABASE_URL do Postgres
npm run db:migrate        # cria as tabelas
npm run db:seed           # popula produtos + usuário admin
npm run dev                # http://localhost:3000
```

Login do admin (via seed): e-mail e senha definidos em `ADMIN_EMAIL` / `ADMIN_PASSWORD` no `.env` (padrão: `contato@grassenceparfums.com.br` / `troque-esta-senha` — **troque antes de ir ao ar**).

### Scripts úteis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e execução em produção |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica migrations do Prisma |
| `npm run db:seed` | Repopula o catálogo (apaga pedidos/produtos existentes) |
| `npm run db:studio` | Abre o Prisma Studio para inspecionar o banco |
| `npm run db:reset` | Reseta o banco do zero e roda o seed |
| `npm run db:deploy` | Aplica migrations em produção (não cria novas) |

## Variáveis de ambiente

Veja `.env.example`. As mais importantes:

- `SESSION_SECRET` — chave de assinatura da sessão do admin. **Gere uma nova** com `openssl rand -base64 32` antes de produção.
- `MERCADOPAGO_ACCESS_TOKEN` / `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` — credenciais do [painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel). Sem elas, o checkout registra o pedido normalmente mas não redireciona para pagamento real (mostra um aviso na tela de confirmação).
- `NEXT_PUBLIC_SITE_URL` — usada nas URLs de retorno do Mercado Pago e no webhook; atualize para o domínio real em produção.

## Colocando o Mercado Pago no ar

1. Crie uma aplicação em https://www.mercadopago.com.br/developers/panel
2. Copie o **Access Token** e a **Public Key** (comece com as credenciais de teste/sandbox)
3. Preencha `MERCADOPAGO_ACCESS_TOKEN` e `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` no `.env`
4. Configure a notificação (webhook) para `https://SEU-DOMINIO/api/webhooks/mercadopago` no painel do Mercado Pago (ou deixe o `notification_url` enviado automaticamente na criação da preferência cuidar disso)
5. Teste um pedido completo com um comprador de teste antes de trocar para credenciais de produção

## Banco de dados

O projeto usa **PostgreSQL** em qualquer ambiente (via `@prisma/adapter-pg`). Não use SQLite na Vercel: o filesystem é efêmero e os pedidos seriam perdidos a cada invocação.

Provedores gratuitos que funcionam bem: [Neon](https://neon.tech), [Supabase](https://supabase.com) ou o Postgres do Marketplace da própria Vercel.

## Substituindo a arte dos frascos por fotos reais

Como ainda não há fotos dos produtos, cada perfume usa uma ilustração vetorial abstrata gerada em `src/components/ui/BottleArt.tsx` (varia forma e paleta por produto, mantendo a identidade visual). Para usar fotos reais:

1. Adicione um campo `imageUrl` ao model `Product` no `prisma/schema.prisma` e rode uma migration
2. Faça upload das fotos (ex: Vercel Blob, S3, Cloudinary) e salve a URL no produto via painel admin (será necessário adicionar o campo ao formulário em `src/components/admin/ProductForm.tsx`)
3. Troque `<BottleArt />` por `<Image src={product.imageUrl} ... />` (componente `next/image`) nos locais relevantes (`ProductCard`, página de produto, `CartDrawer`)

## Deploy na Vercel (passo a passo)

> **Ordem importa.** A home e o sitemap são pré-renderizados no build e consultam o banco.
> Se você mandar pra Vercel antes de criar as tabelas, **o build falha**.
> Por isso os passos 1 e 2 vêm antes do deploy.

### 1. Criar o banco Postgres

Crie um projeto no [Neon](https://neon.tech) (ou Supabase) e copie a **connection string**. Ela se parece com:

```
postgresql://usuario:senha@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. Criar as tabelas e popular o catálogo

Ainda na sua máquina, com a string do banco **de produção** no `.env`:

```bash
npm run db:migrate
```

```bash
npm run db:seed
```

Isso cria as tabelas e insere os 55 perfumes + o usuário admin. Confira em `npm run db:studio`.

### 3. Subir o código para o GitHub

O repositório git já está iniciado com o primeiro commit. Crie um repositório vazio no GitHub e:

```bash
git remote add origin https://github.com/SEU-USUARIO/grassence-parfums.git
```

```bash
git push -u origin master
```

### 4. Importar na Vercel

Em [vercel.com/new](https://vercel.com/new), importe o repositório. A Vercel detecta Next.js sozinha — não mude Build Command nem Output Directory.

### 5. Configurar as variáveis de ambiente

Em **Settings → Environment Variables**, adicione (marque Production, Preview e Development):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a connection string do passo 1 |
| `SESSION_SECRET` | gere com `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://seu-projeto.vercel.app` (sem barra no final) |
| `MERCADOPAGO_ACCESS_TOKEN` | seu Access Token |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | sua Public Key |

`ADMIN_EMAIL`, `ADMIN_NAME` e `ADMIN_PASSWORD` só são usados pelo seed (que você já rodou localmente), então não precisam ir para a Vercel.

### 6. Deploy

Clique em **Deploy**. O build roda `prisma generate && next build`.

### 7. Ajustes pós-deploy

1. Se configurar domínio próprio, **atualize `NEXT_PUBLIC_SITE_URL`** e faça um redeploy — senão o retorno do Mercado Pago aponta pro domínio antigo.
2. No painel do Mercado Pago, aponte o webhook para `https://SEU-DOMINIO/api/webhooks/mercadopago`.
3. Faça um pedido de teste completo (sandbox) e confirme que ele aparece em `/admin/pedidos`.
4. **Troque a senha do admin** se ainda estiver a padrão do seed.

### Atualizações futuras

Todo `git push` para a branch principal dispara um novo deploy automático. Se mudar o `schema.prisma`, rode `npm run db:migrate` local (gera a migration), commite, e depois rode `npm run db:deploy` apontando para o banco de produção.

## Limitações conhecidas / próximos passos

Itens sinalizados no código com `TODO` que precisam de decisão de negócio antes de produção:

- **Newsletter e formulário de contato** (`src/lib/actions/newsletter.ts`, `src/lib/actions/contact.ts`): hoje apenas validam e confirmam — integre com um provedor de e-mail (Resend, Mailchimp, Klaviyo) para de fato armazenar/enviar.
- **Frete**: usa uma regra fixa (`src/lib/mercadopago.ts` — `FLAT_SHIPPING_CENTS` / `FREE_SHIPPING_THRESHOLD_CENTS`). Para cálculo real por CEP, integre a API dos Correios ou um agregador (Melhor Envio, Frenet).
- **Fotos de produto**: veja seção acima.
- **E-mails transacionais**: confirmação de pedido e atualização de status não enviam e-mail/WhatsApp automaticamente hoje — apenas atualizam o painel. Considere Resend + um trigger no webhook do Mercado Pago.

## Estrutura do projeto

```
src/
  app/                    rotas (App Router)
    admin/                painel administrativo (protegido)
    api/                  checkout + webhook do Mercado Pago
    loja/                 catálogo e página de produto
    checkout/             checkout, sucesso, erro
  components/             componentes de UI por domínio (home, shop, product, checkout, admin, layout, ui)
  lib/                    acesso a dados, ações de servidor, autenticação, utilitários
  generated/prisma/       cliente Prisma gerado (não editar manualmente)
prisma/
  schema.prisma           modelos do banco
  seed.ts                 catálogo inicial (55 produtos) + usuário admin
```
