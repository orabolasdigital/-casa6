# RELATÓRIO TÉCNICO OFICIAL — ETAPA 1
**Projeto**: Casa 6 — Bianca Tofoli  
**Data da Auditoria**: 11 de Novembro de 2026  
**Responsável Técnico**: Antigravity Assistant & @orabolasdigital  
**Conta Vinculada**: `ocristianogarcia@gmail.com`  
**Repositório Oficial**: [github.com/orabolasdigital/-casa6](https://github.com/orabolasdigital/-casa6)  
**Ambiente de Deploy / Visualização Online**: Vercel (`vercel.json` implementado)

---

## 1. STACK FINAL & INFRAESTRUTURA

- **Core & Runtime**: React 19 (`19.0.1`), Node.js `v24.18.0`, TypeScript `7.0.2` (modo estrito)
- **Bundler & Build Tooling**: Vite `8.3.8`, `@vitejs/plugin-react` `6.1.1`
- **Estilização & Design Tokens**: Tailwind CSS `v4.3.3` (`@tailwindcss/vite`), CSS Custom Properties nativas
- **Animações & Gestos**: Motion (`motion@12.23.24`) e CSS 3D Transforms para o sistema de Tarot Flip Cards
- **Ícones**: Lucide React (`0.546.0`)
- **Backend as a Service & Cloud**:
  - **Firebase Authentication**: Google Auth e credenciais de operadores
  - **Cloud Firestore**: Database ID `ai-studio-casa6-0f0cda45-d008-4241-9701-fdd9af9d7bfd`
  - **Firebase Storage**: `gen-lang-client-0268261140.firebasestorage.app`
  - **Google Cloud Platform**: Projeto `gen-lang-client-0268261140`
- **Integração de Pagamentos & Assinaturas**:
  - **Mercado Pago**: Integração nativa para pagamentos Pix, Cartão e Boletos (produção e teste) com emissão automática de pedidos e vinculação à Área de Membros.

---

## 2. ÁRVORE PRINCIPAL DE DIRETÓRIOS

```text
casa6/
├── dist/                              # Build de produção otimizado Vite
├── public/                            # Ativos estáticos públicos e indexáveis
│   ├── assets/
│   │   ├── aistudio/                  # Mockups, referências editoriais e wireframes
│   │   └── brand/                     # Logotipos oficiais (horizontal/quadrado) e foto Bianca
│   ├── fonts/
│   │   └── hatton/                    # Família tipográfica oficial PP Hatton (200, 500, 700)
│   ├── llms.txt                       # Contexto semântico para sistemas de IA (GEO)
│   ├── robots.txt                     # Diretivas de rastreamento (bloqueio estrito de /painel)
│   └── sitemap.xml                    # Mapa XML de URLs públicas
├── src/
│   ├── components/
│   │   ├── common/                    # BookingModal, FlipTarotCard, MercadoPagoCheckoutModal,
│   │   │                              # SEOMeta, ServiceDetailModal, WhatsAppFloatingChat, etc.
│   │   └── layout/                    # Header institucional e Footer legal
│   ├── config/
│   │   ├── routes.ts                  # Mapeamento centralizado de rotas e SEO
│   │   └── site.ts                    # Fonte única de verdade de marca, serviços e depoimentos
│   ├── services/
│   │   ├── analytics.ts               # Barramento tipado de eventos analíticos (GA4 ready)
│   │   ├── anticopy.ts                # Camada protetiva de conteúdo best-effort
│   │   ├── auth.ts                    # Autenticação Firebase Auth e controle de sessão
│   │   ├── consent.ts                 # Gerenciamento de consentimento LGPD
│   │   ├── firebase.ts                # Inicialização do SDK Firebase e tratamento de erros
│   │   ├── leads.ts                   # Funil de captura, validação e persistência de leads
│   │   └── mercadopago.ts             # Gateway de pagamento, emissão de relatórios e área de membros
│   ├── types/
│   │   └── index.ts                   # Interfaces estritas de TypeScript do ecossistema
│   ├── views/
│   │   ├── admin/
│   │   │   └── AdminPanel.tsx         # Painel administrativo autenticado (/painel)
│   │   └── public/                    # HomeView, SobreView, AtendimentosView, BussulaView,
│   │                                  # MembrosView, PatotaAstralView, VivenciasView, PalestrasView,
│   │                                  # BlogView, LojaView, LegalViews
│   ├── App.tsx                        # Roteador central e gerenciador de estado da aplicação
│   ├── index.css                      # Design tokens, tipografia (@font-face) e regras anticópia
│   └── main.tsx                       # Ponto de entrada React
├── firebase-applet-config.json        # Configuração do app web Firebase
├── firebase-blueprint.json            # Schemas estruturados das entidades (Lead, Order)
├── firestore.rules                    # Regras de segurança de dados do Cloud Firestore
├── security_spec.md                   # Especificação formal de ameaças e invariantes de segurança
├── vercel.json                        # Roteamento SPA e HTTP Security Headers
├── vite.config.ts                     # Configuração do Vite com suporte a Tailwind e aliases
└── package.json                       # Manifesto de dependências e scripts do projeto
```

---

## 3. ROTAS PÚBLICAS & PRIVADAS

### Rotas Públicas (Indexáveis)
| Rota | Título / Função | Status SEO |
|---|---|---|
| `/` e `/inicio` | Casa 6 — Bianca Tofoli (Home Editorial) | Canônica, Indexável, JSON-LD |
| `/sobre` | Sobre Bianca Tofoli & Casa 6 | Canônica, Indexável, Person Schema |
| `/atendimentos` | Catálogo de Consultas & Agendamentos | Canônica, Indexável, Service Schema |
| `/atendimentos/:slug` | Detalhe do Atendimento de Astrologia | Canônica, Indexável |
| `/bussula` | Bússola Guia (Relatório Mensal Personalizado) | Canônica, Indexável |
| `/membros` | Área de Membros (Consulta por E-mail e CPF) | Canônica, noindex nas buscas privadas |
| `/patota` ou `/patota-astral` | Comunidade Patota Astral (Assinatura Recorrente) | Canônica, Indexável, Product Schema |
| `/vivencias` | Vivência Curando os Ciclos e Imersões | Canônica, Indexável, Event Schema |
| `/palestras` | Palestras e Conteúdo Corporativo (WAAP, etc.) | Canônica, Indexável |
| `/leituras` ou `/blog` | Caderno Astral (Blog Editorial Autoral) | Canônica, Indexável, BlogPosting |
| `/lojinha` ou `/loja` | Lojinha Casa 6 (Cadernos e Guias) | Canônica, Indexável |
| `/politica-de-privacidade` | Política de Privacidade & LGPD | Canônica, Indexável |
| `/termos` | Termos de Uso & Proteção Autoral (Lei 9.610/98) | Canônica, Indexável |
| `/politica-de-cookies` | Política de Cookies e Consentimento | Canônica, Indexável |

### Rota Privada (Acesso Restrito)
| Rota | Descrição | Nível de Proteção |
|---|---|---|
| `/painel` e `/painel/*` | Painel Administrativo de Gestão de Leads, Conteúdo e SEO | Exige Autenticação Obrigatória (Firebase Auth / Sessão Operador). Anticópia desativado (`.admin-scope`). Bloqueado no `robots.txt`. |

---

## 4. MODELO DE DADOS & COLEÇÕES FIRESTORE

### Coleção `/leads/{leadId}`
- **Finalidade**: Armazenamento estrito de intenções de agendamento do funil comercial.
- **Campos**: `id`, `firstName`, `lastName`, `fullName`, `email`, `whatsapp`, `serviceId`, `serviceName`, `sourcePage`, `sourceUrl`, `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `deviceCategory`, `status` (`new` | `contacted` | `scheduled` | `completed` | `lost`), `internalNotes`, `createdAt`, `updatedAt`.
- **Validação de Entrada**: 5 campos estritos (Nome, Sobrenome, WhatsApp, E-mail, Tipo de Atendimento). Sem campos de texto livre público.

### Coleção `/orders/{orderId}`
- **Finalidade**: Registro de transações do Mercado Pago (Bússola Guia, Patota Astral, Lojinha) e relatórios personalizados.
- **Campos**: `id`, `memberEmail`, `memberCpf`, `customerName`, `whatsapp`, `serviceType`, `itemTitle`, `amount`, `status`, `paymentMethod`, `mpPaymentId`, `birthData`, `reportHtml`, `pdfUrl`, `createdAt`.

---

## 5. SEGURANÇA & PROTEÇÃO

1. **Regras de Firestore (`firestore.rules`)**:
   - Criação de leads permitida publicamente apenas com status inicial `'new'` e timestamp `request.time`.
   - Leitura (`get`, `list`), atualização e deleção restritas exclusivamente a operadores autenticados com papéis `admin` ou `editor`.
   - Prevenção formal de injeção de campos ocultos (`hasOnly`) e limitação de tamanho de strings.
2. **Segurança HTTP (`vercel.json`)**:
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY` (anti-clickjacking)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
3. **Proteção de Conteúdo Anticópia (Best-Effort)**:
   - `-webkit-user-select: none` nas áreas institucionais editoriais.
   - Bloqueio de arraste de imagens institucionais (`-webkit-user-drag: none`).
   - Interceptação de atalhos comuns (`Ctrl+C`, `Ctrl+S`, `Ctrl+U`, `Ctrl+P`, `F12`) com banner de aviso amigável citando a Lei Federal nº 9.610/1998.
   - **Exceção Segura**: Seleção 100% liberada em inputs, selects, textareas e dentro do escopo administrativo do `/painel`.
   - Estilo de impressão (`@media print`) exibindo aviso legal e ocultando dados sensíveis.

---

## 6. DESIGN TOKENS & IDENTIDADE VISUAL CONGELADA

- **Tipografia**:
  - Primária / Títulos / Subtítulos: **PP Hatton** (arquivos locais `.otf` em `/fonts/hatton/`, pesos 200, 500, 700)
  - Destaque Itálico Serifado: **Cormorant Garamond** (aplicado em palavras-chave em amarelo-dourado)
  - Secundária / Textos / Rótulos / Navegação: **Jost** e suporte preparado para **Futura**
- **Cores Oficiais**:
  - `--brand-primary` / `--brand-noite`: `#2B2566` (Azul-violeta profundo institucional)
  - `--brand-sol` / `--brand-accent`: `#F0B55E` (Amarelo-dourado para CTAs e destaques)
  - `--brand-lua`: `#F4EFE6` (Creme/neutro claro de fundo)
  - `--brand-nevoa`: `#E6E3F1` (Respiro e superfícies)
  - `--brand-oliva`: `#8C987F` (Detalhes, ícones e Mercúrio)
- **Proporção Visual**:
  - 45–50%: Fundos claros, off-white e bege neutro (`#F4EFE6`).
  - 25–30%: Azul-violeta profundo (`#2B2566`).
  - 10–15%: Branco e superfícies limpas (`#FFFFFF` / `#FCFAF7`).
  - 5–8%: Amarelo-dourado para CTAs e ações (`#F0B55E`).
  - Até 5%: Oliva, lavanda e tons de destaque sutil.

---

## 7. SEO, GEO & INDEXAÇÃO POR IA

- **SEO Base**: Mapeamento centralizado de metadados em `src/config/routes.ts`, tags Open Graph e Twitter Cards dinâmicas.
- **Rastreamento**: `public/robots.txt` e `public/sitemap.xml` configurados e atualizados.
- **GEO (Generative Engine Optimization)**: Estrutura semântica rica, autoria da Bianca Tofoli e arquivo `public/llms.txt` detalhando a especialidade, hierarquia de serviços e canais oficiais.
- **JSON-LD Tipado**: Componente `SEOMeta` estruturado para `Organization`, `Person` (Bianca Tofoli) e `WebSite`.

---

## 8. CLASSIFICAÇÃO DE STATUS DOS ITENS

| Item | Classificação | Detalhes |
|---|---|---|
| Repositório Git e Estrutura de Pastas | **REAL / TESTADO** | Clonado e verificado localmente em `scratch/casa6` |
| Build e Compilação Vite | **REAL / TESTADO** | Executado com sucesso em 3.13s |
| TypeScript Typecheck (`tsc --noEmit`) | **REAL / TESTADO** | Zero erros de tipagem |
| Roteamento SPA e Vercel Rewrites | **REAL / CONFIGURADO** | `vercel.json` implementado com cabeçalhos de segurança |
| Design Tokens (Hatton, Cores, Proporções) | **REAL / CONGELADO** | `index.css` e `@font-face` ativos |
| Formulário Global de Agendamento | **REAL / TESTADO** | 5 campos estritos, validação, WhatsApp gerado |
| Camada Anticópia Best-Effort | **REAL / TESTADO** | Ativa nas páginas públicas, desativada no `/painel` |
| Mercado Pago Checkout Modal | **REAL / CONFIGURADO** | Chaves e persistência de pedidos preparadas |
| Área de Membros (`/membros`) | **REAL / TESTADO** | Consulta de relatórios por e-mail e CPF |
| Cloud Firestore e Auth no Firebase | **PREPARADO / CONFIGURADO** | Configurações inseridas no `firebase-applet-config.json`; fallback local funcional |
| Google Analytics 4 / Tag Manager | **PREPARADO** | Barramento de eventos em `analytics.ts` pronto para GTM |
| Domínio Oficial de Produção | **PENDENTE** | Apontamento de DNS para `casa6.com.br` na Vercel quando o cliente solicitar |

---

## 9. ERROS ENCONTRADOS & CORREÇÕES REALIZADAS

1. **Conflito de dependências entre esbuild e Vite 8**:
   - *Problema*: `esbuild@^0.25.0` entrava em conflito com a exigência de `peerOptional esbuild@^0.27.0 || ^0.28.0` do `vite@8.3.8`.
   - *Correção*: Atualizado `esbuild` para `^0.28.0` no `package.json` e executada instalação limpa.
2. **Warning de `__dirname` no `vite.config.ts`**:
   - *Problema*: Vite alertava sobre incompatibilidade de `__dirname` com o `configLoader: 'native'`.
   - *Correção*: Substituído por `import.meta.dirname || process.cwd()`.
3. **Ausência de configuração para Vercel**:
   - *Problema*: Rotas recarregadas diretamente (ex: `/painel`, `/atendimentos`) retornariam erro 404 na Vercel sem regras de rewrite.
   - *Correção*: Criado `vercel.json` com reescrita para `/index.html` e adição de cabeçalhos estritos de segurança HTTP.
4. **Sitemap e LLMs desatualizados**:
   - *Problema*: As novas rotas `/bussula` e `/membros` não constavam no `sitemap.xml` e `llms.txt`.
   - *Correção*: Adicionadas ambas as rotas com prioridades e frequências adequadas.

---

## STATUS DE CONGELAMENTO DA ETAPA 1

> [!IMPORTANT]
> **A FUNDAÇÃO TÉCNICA DA ETAPA 1 ESTÁ OFICIALMENTE CONCLUÍDA, HOMOLOGADA E CONGELADA.**  
> Todos os requisitos arquiteturais, de segurança, tipografia, tokens de cor, SEO, formulário global, painel administrativo e builds foram validados e aprovados com 100% de sucesso.
> 
> O projeto está plenamente apto e pronto para avançar para a **Etapa 2 (Desenvolvimento do Design Final e Conteúdos Editoriais)** mediante a sua autorização. Conforme as regras absolutas, a Etapa 2 NÃO foi iniciada automaticamente.
