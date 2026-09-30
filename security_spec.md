# Casa 6 — Bianca Tofoli: Security Specification (Firestore Rules Architecture)

## Phase 0: Data Invariants & Zero-Trust Threat Model

### 1. Invariantes de Dados Fundamentais
1. **Invariante de Lead (Integridade do Funil Comercial)**:
   - Um lead DEVE conter apenas dados capturados no formulário estrito (firstName, lastName, fullName, email, whatsapp, serviceId, serviceName, sourcePage, sourceUrl, utm*, deviceCategory, status, createdAt, updatedAt).
   - O campo `status` inicial na criação DEVE ser obrigatoriamente `'new'`.
   - É terminantemente PROIBIDO campos arbitrários ou injeção de payload livre no formulário público.
   - Leads são públicos para submissão (criação anônima permitida para geração de agendamentos), porém leitura (`get` e `list`), atualização e deleção são **exclusivos de administradores autenticados com verificação de email**.
   - O campo `createdAt` deve corresponder estritamente a `request.time`.

2. **Invariante de PII (Proteção de Dados Pessoais - LGPD)**:
   - Os dados de leads (nome, telefone, e-mail) constituem PII sensível de clientes de astrologia.
   - Nenhuma listagem pública ou consulta direta por terceiros é permitida sob hipótese alguma.
   - Apenas tokens autenticados pertencentes aos papéis de `admin` ou `editor` podem acessar a coleção `/leads`.

3. **Invariante de Imutabilidade**:
   - Campos de identificação e criação (`id`, `createdAt`, `serviceId`) são imutáveis após a criação do lead.
   - Ao transicionar um lead para status terminal (`completed` ou `lost`), apenas usuários com função `admin` podem reabrir o registro.

4. **Invariante de RBAC & Prevenção de Autoatribuição de Papéis**:
   - Usuários não podem alterar seu próprio `role` no documento `/users/{userId}`.
   - Apenas documentos presentes na coleção administrativa ou validados no documento de autorização podem executar mutações restritas.

---

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Vetor de Ataque | Descrição do Payload Malicioso | Regra de Bloqueio Esperada |
|---|-----------------|--------------------------------|----------------------------|
| 1 | **Status Hijack** | Criar lead com `status: "completed"` | `incoming().status == 'new'` falha -> REJECT |
| 2 | **Shadow Fields Injection** | Payload com `isAdmin: true` ou `discountCode: "100"` | `data.keys().hasOnly([...])` falha -> REJECT |
| 3 | **Client-Forged Timestamp** | `createdAt: "2020-01-01T00:00:00Z"` | `incoming().createdAt == request.time` -> REJECT |
| 4 | **Unbounded String Flooding** | `firstName: "A".repeat(5000)` (Denial of Wallet) | `data.firstName.size() <= 50` -> REJECT |
| 5 | **Public Lead Harvest** | Usuário anônimo executando `getDocs(collection(db, "leads"))` | `allow list: if isAdmin() || isEditor()` -> PERMISSION_DENIED |
| 6 | **ID Poisoning** | `POST /leads/../../../etc/passwd` ou ID com caracteres de controle | `isValidId(leadId)` -> REJECT |
| 7 | **Unauthorized Status Mutation** | Usuário não autenticado executando `updateDoc(leadRef, { status: "contacted" })` | `allow update: if (isAdmin() || isEditor())` -> PERMISSION_DENIED |
| 8 | **Lead Deletion by Editor** | Editor tentando deletar lead permanente | `allow delete: if isAdmin()` -> PERMISSION_DENIED |
| 9 | **Self Role Escalation** | Usuário comum tenta escrever `users/{uid}` com `role: "admin"` | Bloqueio de autoatribuição de role -> REJECT |
| 10 | **Malformed Email / XSS Script Injection** | `email: "<script>alert(1)</script>@test.com"` | Validação de formato e tamanho de email -> REJECT |
| 11 | **Public Settings Mutation** | Usuário anônimo tenta alterar o WhatsApp oficial da Casa 6 em `/settings/general` | `allow write: if isAdmin()` -> PERMISSION_DENIED |
| 12 | **Immutable Timestamp Overwrite** | Modificação de `createdAt` na atualização de um lead | `incoming().createdAt == existing().createdAt` -> REJECT |

---

## 3. Estado de Validação
- **Ambiente Atual**: Arquitetura e regras declaradas em `firestore.rules`.
- **Status Operacional**: CONFIGURADO e PREPARADO para execução em produção após provisionamento do projeto Firebase.
