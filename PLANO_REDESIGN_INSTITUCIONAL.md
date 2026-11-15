# Plano de Redesign Institucional Premium — IPRA Avisos

> **Objetivo:** Elevar o aplicativo **IPRA Avisos** de uma estética colorida/infantilizada para um padrão **institucional, sóbrio e executivo**, preservando 100% da acessibilidade (contraste elevado, escala global de fonte `100%` / `125%`, alvos de toque `>= 48px`, leitura no púlpito OLED e fluxos rápidos para diáconos).
>
> **Regra de ouro:** Documento temporário de referência técnica para execução controlada tela a tela, componente a componente e botão a botão.

---

## 1. Fundamentos do Design System Institucional IPRA (Tokens & Regras Globais)

### 1.1 Regra Cromática 85 / 10 / 5

| Proporção | Papel | Modo Claro (`light`) | Modo Noturno / Púlpito (`dark`) |
| :--- | :--- | :--- | :--- |
| **85%** | **Neutros Arquitetônicos** (fundos, cards, inputs, textos) | Fundo: `#F8FAFC` (`slate-50`)<br>Card: `#FFFFFF`<br>Sub-superfície/Input: `#F8FAFC` (`slate-50`) ou `#F1F5F9` (`slate-100`)<br>Borda padrão: `1px solid #E2E8F0` (`border-slate-200`)<br>Texto primário: `#0F172A` (`slate-900`)<br>Texto secundário: `#475569` (`slate-600`)<br>Texto auxiliar: `#64748B` (`slate-500`) | Fundo: `#040B16`<br>Card: `#0B1528`<br>Sub-superfície/Input: `#060E1C`<br>Borda padrão: `1px solid #1E293B` (`border-slate-800`)<br>Texto primário: `#F8FAFC` (`slate-50`)<br>Texto secundário: `#94A3B8` (`slate-400`)<br>Texto auxiliar: `#64748B` (`slate-500`) |
| **10%** | **Cor Institucional Única** (botões primários, cabeçalhos, abas ativas, seleção) | Marinho Institucional: `#062552` (CTA primário, headers, abas ativas)<br>Azul Real de Foco: `#03589E` (hover, `border-2` selecionada, `ring-2` de foco)<br>Fundo selecionado sutil: `#F0F6FC` | Marinho/Azul Ativo: `#03589E` / `#062552`<br>Destaque/Foco: `#38BDF8` (`sky-400`) / `#60A5FA` (`sky-400`)<br>Fundo selecionado sutil: `#0D213F` |
| **5%** | **Semântica Cirúrgica** (apenas filete `border-l-4`, ícone discreto, status ao vivo e alerta urgente) | Ver tabela semântica abaixo (1.2) | Ver tabela semântica abaixo (1.2) |

### 1.2 Semântica Cirúrgica dos Tipos de Aviso (Sem Faixas Inteiras Coloridas)

Nenhum aviso deve preencher o cabeçalho inteiro do card com cor saturada ou pintar caixas de texto com fundos coloridos. A distinção visual ocorre exclusivamente por **filete lateral esquerdo de `4px` (`border-l-4`)**, **ícone em container suave (`w-7 h-7 rounded-lg`)** e **badge discreta** (com destaque real reservado apenas para `oracao_urgente`).

| Tipo (`AvisoVisualKey`) | Filete Lateral (`border-l-4`) | Ícone (`iconBg` + `iconColor`) | Label / Badge |
| :--- | :--- | :--- | :--- |
| `visitante` | `border-l-[#03589E]` (`dark:border-l-sky-400`) | `bg-slate-100 dark:bg-slate-800` + `text-[#03589E] dark:text-sky-400` | Badge neutra-azul: `bg-slate-100 text-[#062552] border-slate-200 dark:bg-slate-800 dark:text-sky-300 dark:border-slate-700` |
| `oracao` (normal) | `border-l-[#B45309]` (`dark:border-l-amber-500`) | `bg-amber-50/70 dark:bg-amber-950/40` + `text-[#B45309] dark:text-amber-400` | Badge âmbar sóbria: `bg-amber-50/80 text-amber-900 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60` |
| `oracao_urgente` (**Único Alerta Crítico**) | `border-l-[#BE123C]` (`dark:border-l-rose-500`) | `bg-rose-50 dark:bg-rose-950/60` + `text-[#BE123C] dark:text-rose-400` | Badge `URGENTE`: `bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800/80` |
| `reuniao` | `border-l-[#0F766E]` (`dark:border-l-emerald-500`) | `bg-emerald-50/70 dark:bg-emerald-950/40` + `text-emerald-700 dark:text-emerald-400` | Badge neutra: `bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700` |
| `aniversario` | `border-l-[#D97706]` (`dark:border-l-amber-400`) | `bg-amber-50/70 dark:bg-amber-950/40` + `text-amber-600 dark:text-amber-400` | Badge neutra: `bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700` |
| `geral` (Comunicado) | `border-l-[#062552]` (`dark:border-l-slate-400`) | `bg-slate-100 dark:bg-slate-800` + `text-[#062552] dark:text-slate-300` | Badge neutra: `bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700` |

> **Caixa de observação/motivo (`boxBg`):** sempre neutra em todas as categorias (`bg-slate-50 dark:bg-[#060E1C] border border-slate-200/80 dark:border-slate-800`).

### 1.3 Geometria, Bordas e Sinalização Tátil/Acessível

- **Containers principais e Modais:** reduzir de `rounded-3xl` (`24px`) para `rounded-2xl` (`16px`), com borda fina `border` (`1px`) em vez de `border-2`.
- **Botões, Inputs, Chips e Subcards:** reduzir de `rounded-2xl` para `rounded-xl` (`12px`).
- **Pequenos ícones/badges:** `rounded-lg` (`8px`).
- **Acessibilidade pela espessura da borda (sem depender só da cor):**
  - Opção em repouso: `border` (`1px solid`, `border-slate-200` ou `border-slate-300`).
  - Opção selecionada: preenchimento sólido `bg-[#062552] border-2 border-[#062552] text-white` **ou** seleção clara `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white` acompanhada de ícone `Check` quando aplicável.
- **Alvos de toque:** preservar `min-h-[48px]` (ou `min-h-[44px]` em ações secundárias compactas de cabeçalho) e `min-h-[52px]` nos botões principais de formulário/login.

### 1.4 Refinamento Tipográfico

- Preservar integralmente `--font-scale` (`1.0` = Padrão 100%, `1.25` = Grande 125%) em `AccessibilityContext.tsx` e `index.css`.
- Calibrar os pesos para eliminar o aspecto "gritado":
  - Títulos de tela, cabeçalhos de card e nomes no Púlpito: `font-bold` (700) — evita que hastes "embolem" no modo OLED escuro com `font-black` (900).
  - Botões principais, labels de campo e chips selecionados: `font-semibold` (600).
  - Labels inativos, subtítulos, metadados e horários: `font-medium` (500) ou `font-normal` (400).

---

## 2. Mapeamento Arquivo a Arquivo, Tela a Tela e Botão a Botão

### 2.1 Base Global (`index.html`, `tailwind.config.js`, `src/index.css`, `src/App.tsx`)

1. **`index.html`**
   - Linha 18 (`<body>`): trocar `bg-[#F4F7FB] text-[#0D213A]` para `bg-[#F8FAFC] text-[#0F172A]`.
2. **`tailwind.config.js`**
   - Manter cores institucionais `iprb.navy` (`#062552`), `iprb.blue` (`#03589E`), `pulpit.bg` (`#040B16`), atualizar `iprb.surface` para `'#F8FAFC'`, `iprb.border` para `'#E2E8F0'`, `iprb.ink` para `'#0F172A'`.
   - Suavizar `boxShadow`:
     - `'subtle'`: `'0 1px 2px 0 rgba(15, 23, 42, 0.04)'`
     - `'card'`: `'0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)'`
     - `'pulpit'`: `'0 8px 24px -4px rgba(4, 11, 22, 0.65)'`
3. **`src/index.css`**
   - `body`: trocar `@apply bg-[#F4F7FB] text-[#0D213A]` por `@apply bg-[#F8FAFC] text-[#0F172A]`.
4. **`src/App.tsx`**
   - Wrapper principal (`AppContent`): no modo claro usar `bg-[#F8FAFC] dark:bg-[#040B16] text-[#0F172A] dark:text-slate-50`.

---

### 2.2 Motor Visual (`src/utils/avisoVisual.ts`)

Refatorar a interface `AvisoVisualConfig` para abandonar `headerBg` e `cardBorder` saturados:

- **Remover** estilo de barra colorida inteira em `headerBg` (substituir pelos tokens editoriais abaixo):
  - `accentBorderLeft`: classe `border-l-4 border-l-[...]` conforme tabela 1.2.
  - `iconBg`: fundo discreto do ícone `w-7 h-7 rounded-lg`.
  - `iconColor`: cor contida do ícone.
  - `labelColor`: cor sóbria do rótulo da categoria no topo do card.
  - `cardBorder`: neutro padrão (`border-slate-200/90 dark:border-slate-800`) — apenas `oracao_urgente` pode manter borda externa levemente destacada (`border-rose-200/90 dark:border-rose-900/70`) combinada ao `border-l-4 border-l-[#BE123C]`.
  - `cardBg`: neutro único (`bg-white dark:bg-[#0B1528]`).
  - `pillBg`: badge secundária discreta (conforme tabela 1.2).
  - `boxBg`: sempre neutro (`bg-slate-50 dark:bg-[#060E1C] border-slate-200/80 dark:border-slate-800`).
  - `isUrgent?: boolean`: flag explícita para renderizar o selo `URGENTE` somente em `oracao_urgente`.

---

### 2.3 Tela 01 — Login (`src/components/auth/LoginScreen.tsx`)

- **Fundo da tela:** `bg-[#F8FAFC] dark:bg-[#040B16] text-[#0F172A] dark:text-white`.
- **Cabeçalho Institucional:**
  - Fundo: trocar gradiente claro `from-[#062552] to-[#03589E]` por tom executivo profundo `bg-gradient-to-b from-[#041938] to-[#062552]`.
  - **Logo:** substituir `<img src="/logo-ipra.png" ... />` pelo brasão oficial `<img src="/logo-ipra-emblem.png" ... />` em moldura limpa (`w-20 h-20 rounded-full bg-white p-1 shadow-md border-2 border-white/80`).
  - **Título e Subtítulo:** `IPRA Avisos` em `text-2xl font-bold tracking-tight text-white`; subtítulo em `text-sm text-slate-200 font-medium`.
  - **Indicador de Culto Ativo (quando houver):** remover texto amarelo `#FBB016` e ponto laranja `#E85D04`; usar `bg-white/10 border border-white/15 text-xs font-semibold text-white` com ponto `w-2 h-2 rounded-full bg-emerald-400`.
- **Card "Acesso salvo neste aparelho":**
  - Container: `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card p-4`.
  - Avatar circular inicial: `bg-[#062552] dark:bg-[#03589E] text-white font-bold`.
  - Botão Lixeira (`Remover acesso salvo`): `text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg`.
  - Botão **"Entrar como [Nome]"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl min-h-[50px]`.
- **Card "Ou entrar com outro acesso" / "Entrar":**
  - Container: `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card p-5`.
  - Título: `font-bold text-lg text-[#0F172A] dark:text-white`.
  - Labels `Nome` e `Senha`: `text-sm font-semibold text-slate-700 dark:text-slate-200`.
  - Inputs `Nome` e `Senha`: `border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#060E1C] rounded-xl focus:bg-white focus:border-[#03589E] focus:ring-2 focus:ring-[#03589E]/20`; ícones `User` e `KeyRound` em `text-slate-400 dark:text-slate-500` (em vez de azul vivo).
  - Botão **"Ver / Ocultar"** dentro do campo Senha: `text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg`.
  - Checkbox **"Salvar acesso neste aparelho"**: marcado `bg-[#062552] border-[#062552] text-white`, desmarcado `bg-white dark:bg-[#060E1C] border border-slate-300 dark:border-slate-600`; texto `font-medium text-slate-700 dark:text-slate-200`.
  - Botão/Checkbox **"Vou dirigir os avisos hoje"**:
    - Remover `bg-[#FFF9EB] border-[#F59E0B]`, `bg-[#E85D04]` e `Crown` laranja.
    - Estado inativo: `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl`.
    - Estado selecionado: `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white rounded-xl`, checkbox `bg-[#062552] border-[#062552]`, ícone `Crown` `text-[#03589E] dark:text-sky-400` (quando inativo `text-slate-400`).
  - Bloco condicional de **PIN Administrativo (`needsAdminOverride`)**: trocar fundo creme/amarelo por `bg-slate-50 dark:bg-[#060E1C] border border-slate-300 dark:border-slate-700 rounded-xl`, label `text-slate-800 dark:text-slate-200`.
  - Botão **"Entrar"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl shadow-sm min-h-[52px]`.

---

### 2.4 Cabeçalho Global (`src/components/common/Header.tsx`) & Barra Inferior (`src/components/common/BottomNav.tsx`)

#### `Header.tsx`
- Fundo `<header>`:
  - Modo Claro: `bg-[#062552] border-b border-white/10`.
  - Modo Púlpito Noturno (`isPulpitMode`): `bg-[#040B16] border-b border-slate-800`.
- Botão Identidade (`IPRA Auriflama`):
  - Moldura do brasão: `w-9 h-9 rounded-full bg-white p-0.5 border border-white/25` (remover `border-2 border-[#03589E]`).
  - Título: `font-bold text-sm sm:text-base tracking-tight text-white`.
  - Status do culto ativo: remover `animate-ping bg-[#FBB016]`, `bg-[#E85D04]` e `text-[#FBB016]`. Usar ponto `w-2 h-2 rounded-full bg-emerald-400` + nome do culto em `text-slate-200 font-medium`.
- Botão **"Ajustes"** (ícone engrenagem):
  - Estilo: `min-h-[44px] px-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold`.
  - Ícone `Settings`: `w-4 h-4 text-slate-200` (remover `text-[#FBB016]`).
- Botão **"Perfil (`Cláudio v`)"**:
  - Estilo: `min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold`.
- Dropdown do Perfil:
  - Container: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528] shadow-xl`.
  - Bloco usuário: `bg-slate-50 dark:bg-[#060E1C] border-b border-slate-200 dark:border-slate-800`; badges `Dirigente` (`bg-[#F0F6FC] text-[#062552] border border-[#03589E]/25`) e `Admin` (`bg-slate-100 text-slate-700 border border-slate-200`).
  - Item `Sons de Aviso`: ícone `text-[#03589E] dark:text-sky-400`, status pill discreta (`bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200`).
  - Item `Ajustes e Fonte`: ícone e percentual em `text-[#03589E] dark:text-sky-400`.
  - Item `Iniciar Novo Culto`: `text-[#062552] dark:text-sky-300 font-semibold` (remover `dark:text-[#FBB016]`).
  - Item `Sair`: `text-rose-700 dark:text-rose-400 font-semibold`.

#### `BottomNav.tsx`
- Container `<nav>`: `border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#081529]` (`isPulpitMode`: `bg-[#060E1C] border-slate-800`).
- Abas (`Início`, `Enviar Aviso`, `Púlpito`, `Histórico`):
  - **Ativa:** `text-[#062552] dark:text-white font-bold bg-slate-100/70 dark:bg-slate-800/50` + indicador superior `h-[3px] bg-[#062552] dark:bg-sky-400 rounded-b-full` (remover `dark:text-[#FBB016]` e `dark:bg-[#FBB016]`).
  - **Inativa:** `text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium`.
- Badge de contagem pendente na aba `Púlpito`:
  - Trocar `bg-[#E85D04]` (laranja) por `bg-[#03589E] text-white` (azul institucional). *(Opcional: usar `bg-[#BE123C]` somente se houver pedido urgente pendente).*

---

### 2.5 Tela 02 — Início / Hub (`src/components/home/HomeScreen.tsx`)

- **Card de Saudação (`A paz do Senhor, Cláudio`):**
  - Container: `bg-white dark:bg-[#0B1528] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-card`.
  - **Remover** o segundo brasão `/logo-ipra-emblem.png` do lado direito para eliminar redundância visual com o Header.
  - Título: `font-bold text-slate-900 dark:text-white`.
  - Badge Cargo (`Pastor Titular`): `bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold`.
  - Badge `Dirigente`: remover fundo creme/laranja (`bg-[#FFF4E5] border-[#F59E0B]/40 text-[#9A3412]`); usar `bg-[#F0F6FC] dark:bg-[#0D213F] text-[#062552] dark:text-sky-300 border border-[#03589E]/25 rounded-lg font-semibold`.
- **Card do Culto Atual:**
  - Container: `bg-white dark:bg-[#0B1528] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-card`.
  - Pill **"Culto ao Vivo"**: `bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-semibold`.
  - Caixa contador **"X para ler"**: remover `bg-[#FFF4E5] border-[#F59E0B]/50 text-[#E85D04]`; usar bloco institucional `bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-[#062552] dark:text-white`.
  - **Grade 2x2 de Contadores (`Visitantes`, `Orações`, `Reuniões`, `Comunicados`):**
    - Botões dos cards: `rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060E1C] hover:border-[#03589E]`.
    - **Remover** `iconBg` colorido diferente para cada item (`bg-[#03589E]`, `bg-[#E85D04]`, `bg-emerald-700`, `bg-[#062552]`). Padronizar todos com `p-2 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-[#062552] dark:text-sky-300`.
    - Número: `text-2xl font-bold text-slate-900 dark:text-white`.
    - Rótulo: `text-sm font-semibold text-slate-700 dark:text-slate-300`.
  - **Botões Principais:**
    - Primário (`Abrir Púlpito` ou `Enviar Aviso` para diácono): `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl shadow-sm min-h-[52px]`.
    - Secundário (`Enviar Aviso` para dirigente ou `Ver Púlpito` para diácono): `bg-white dark:bg-[#060E1C] border border-slate-300 dark:border-slate-700 text-[#062552] dark:text-white hover:bg-slate-50 font-semibold rounded-xl min-h-[52px]`.
- **Card "Nenhum culto aberto":**
  - Container `rounded-2xl border border-slate-200 dark:border-slate-800`, ícone em `bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#062552] dark:text-sky-300 rounded-xl`.
  - Botão **"Iniciar Culto"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl min-h-[52px]`.
- **Ações Secundárias:**
  - Botão **"Histórico de Cultos"**: `rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528] hover:border-[#03589E] text-slate-800 dark:text-slate-100 font-semibold`, ícone `text-[#062552] dark:text-sky-400`.
  - Botão **"Encerrar Culto"**: `rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528] hover:border-rose-300 text-slate-700 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-400 font-semibold`, seta discreta `text-slate-400`.
  - Painel de Confirmação ("Encerrar culto agora?"): `rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/70`; botões `Continuar` (`rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold`) e `Encerrar` (`rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold`).

---

### 2.6 Tela 03 — Modal Iniciar Culto (`src/components/culto/IniciarCultoModal.tsx`)

- Container modal: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528]`.
- Cabeçalho: `bg-[#062552] text-white`, ícone `Church` em `text-sky-200` (remover `text-[#FBB016]`), botão fechar `X` em `bg-white/10 hover:bg-white/20 rounded-xl`.
- **1. Qual é o culto de hoje?**:
  - Botão selecionado: `bg-[#062552] border-2 border-[#062552] text-white rounded-xl font-semibold`.
  - Botão inativo: `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#03589E] rounded-xl font-medium`.
- **2. Horário de início**:
  - Input: `rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#060E1C] font-semibold`.
- **3. Quem vai dirigir os avisos hoje?**:
  - Ícone `Crown` do título em `text-[#062552] dark:text-sky-400` (remover `#E85D04`).
  - Card de obreiro **selecionado**: remover `bg-[#FFF4E5] border-[#E85D04]`; usar `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white rounded-xl`; ícone `Check` em `text-[#03589E] dark:text-sky-400`.
  - Card de obreiro inativo: `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl`.
- **Botões do Rodapé:**
  - `Cancelar`: `rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#060E1C] text-slate-700 dark:text-slate-200 font-semibold min-h-[50px]`.
  - `Abrir Culto`: `rounded-xl bg-[#062552] hover:bg-[#03589E] text-white font-semibold min-h-[50px]`.

---

### 2.7 Telas 04 a 07 — Área de Envio de Avisos (`src/components/diacono/*`)

#### `DiaconoDashboard.tsx`
- Barra compacta de status do culto: `rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528]`, ícone `Church` em `text-[#062552] dark:text-sky-400`, pill `Ao Vivo` em `bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300`.
- Banner de "Nenhum culto aberto": trocar laranja forte por `bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 rounded-xl`.
- **Seletor 2x2 de Categorias (`Visitante`, `Oração`, `Reunião`, `Comunicado`):**
  - **Eliminar** a troca de cor por categoria (`#E85D04` laranja, `bg-emerald-700` verde).
  - **Qualquer aba ativa:** `bg-[#062552] dark:bg-[#03589E] border-2 border-[#062552] dark:border-[#03589E] text-white shadow-sm rounded-xl`.
  - **Qualquer aba inativa:** `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#03589E] rounded-xl`, ícone `text-[#03589E] dark:text-sky-400`, texto `font-semibold`.
- **Cartão do Formulário Ativo:**
  - Container: `bg-white dark:bg-[#0B1528] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card`.
  - Cabeçalho do cartão (`Registrar Visitante`, `Pedido de Oração`, `Aviso de Reunião`, `Novo Comunicado`): `bg-slate-50/90 dark:bg-[#060E1C] px-5 py-3.5 border-b border-slate-200 dark:border-slate-800`, ícone `text-[#062552] dark:text-sky-400`, título `font-bold text-slate-900 dark:text-white`.

#### `FormVisitante.tsx` (Tela 04)
- Labels: `text-sm font-semibold text-slate-800 dark:text-slate-200`, ícones `text-slate-500 dark:text-slate-400`.
- Inputs (`vis-nome`, `vis-cidade`, `vis-igreja`, `vis-obs`): `rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#060E1C] focus:bg-white focus:border-[#03589E] focus:ring-2 focus:ring-[#03589E]/20`.
- Botões **"Quem é o visitante?"** (`Irmão / Homem`, `Irmã / Mulher`, `Casal`, `Família`, `Jovem / Criança`):
  - Selecionado: `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white font-semibold rounded-xl`.
  - Inativo: `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl`.
- Botão **"Enviar Visitante"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl shadow-sm min-h-[52px]`.

#### `FormOracao.tsx` (Tela 05)
- **Eliminar todo o laranja (`#E85D04`)** de labels, foco, opções selecionadas e botão enviar.
- Ícone `Heart` do label: `text-[#062552] dark:text-sky-400` (ou `text-slate-500`).
- Inputs (`ora-nome`, `ora-motivo`): mesmo padrão neutro com foco `#03589E` (`rounded-xl border border-slate-300`).
- Botões **"Tipo do Pedido"** (`Saúde e Cirurgia`, `Família e Lar`, `Trabalho e Causas`, `Vida Espiritual`, `Agradecimento`, `Consolo no Luto`, `Outro Motivo`):
  - Selecionado: `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white font-semibold rounded-xl`.
  - Inativo: `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl`.
- Botão/Checkbox **"Pedido Urgente"** (único ponto com cor de alerta quando ativo):
  - Em repouso: `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl`, ícone `AlertTriangle` em `text-slate-500`.
  - Marcado (`urgente === true`): `bg-rose-50/70 dark:bg-rose-950/40 border-2 border-rose-600 dark:border-rose-500 rounded-xl`, checkbox `bg-rose-600 border-rose-600`, título `text-rose-900 dark:text-rose-200`.
- Botão **"Enviar Oração"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl shadow-sm min-h-[52px]`.

#### `FormReuniao.tsx` (Tela 06)
- **Eliminar todo o verde (`bg-emerald-700` / `border-emerald-600`)** de chips, ícones, foco e botão enviar.
- Ícones de seção (`Users`, `Calendar`, `Clock`, `MapPin`): `text-slate-500 dark:text-slate-400` ou `text-[#062552] dark:text-sky-400`.
- Bloco agrupador **"Quando?" (`Qual dia?` + `Qual horário?`)**: `bg-slate-50/80 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl p-4`.
- Todos os seletores (**Qual Reunião?**, **Qual dia?**, **Qual horário?**, **Onde vai acontecer?**):
  - Selecionado: `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white font-semibold rounded-xl`.
  - Inativo: `bg-white dark:bg-[#0B1528] (ou bg-slate-50/70 fora do bloco) border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl`.
- Inputs (`grupoPersonalizado`, `dataPersonalizadaIso`, `horarioPersonalizado`, `reu-local`, `reu-resp`): padrão neutro `rounded-xl border border-slate-300 focus:border-[#03589E]`.
- Botão **"Enviar Reunião"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl shadow-sm min-h-[52px]` (remover `shadow-emerald-700/25` e `font-black`).

#### `FormAvisoGeral.tsx` (Tela 07)
- Ícones (`Megaphone`, `Calendar`, `Users`): `text-slate-500 dark:text-slate-400`.
- Inputs (`titulo`, `descricao`, `dataEvento`, `destinatario`): `rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-[#060E1C] focus:border-[#03589E]`.
- Chips de sugestão (**Aniversário**, **Santa Ceia**, **Jejum da Igreja**, **Vigília de Oração**):
  - **Eliminar** o estilo amarelo/dourado (`bg-amber-50 border-amber-300` e `bg-[#D97706]`) do botão `Aniversário`.
  - Todos os 4 chips seguem o mesmo padrão: inativo `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium`; ativo `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 text-[#062552] dark:text-white rounded-xl font-semibold`.
- Botão **"Enviar Comunicado"**: `bg-[#062552] hover:bg-[#03589E] text-white font-semibold rounded-xl shadow-sm min-h-[52px]`.

#### `MeusAvisosHoje.tsx` & `EditarAvisoModal.tsx`
- **`MeusAvisosHoje.tsx`**:
  - Substituir a faixa superior colorida (`visual.headerBg`) pelo padrão editorial com `border border-slate-200 dark:border-slate-800 border-l-4 ${visual.accentBorderLeft} bg-white dark:bg-[#0B1528] rounded-xl`.
  - Card já lido: `opacity-80 bg-slate-50 dark:bg-[#0B1528]/70 border border-slate-200 dark:border-slate-800 border-l-4 border-l-slate-300 dark:border-l-slate-700`.
  - Botão **Editar**: `rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 text-[#062552] dark:text-sky-300 font-semibold min-h-[42px]`.
  - Botão **Excluir**: `rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 text-slate-600 hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-400 font-semibold min-h-[42px]`.
- **`EditarAvisoModal.tsx`**:
  - Modal `rounded-2xl border border-slate-200 dark:border-slate-800`, cabeçalho `bg-[#062552]`, inputs `rounded-xl border border-slate-300`, chips selecionados com `bg-[#F0F6FC] border-2 border-[#03589E] text-[#062552]` (ou `bg-[#062552] text-white`), botões `Cancelar` (`rounded-xl border border-slate-300`) e `Salvar` (`rounded-xl bg-[#062552] hover:bg-[#03589E] text-white font-semibold`).

---

### 2.8 Telas 08, 09 e 14 — Púlpito (`PulpitoScreen.tsx` & `AvisoCardPulpito.tsx`)

#### `PulpitoScreen.tsx`
- Card superior de controle: `bg-white dark:bg-[#0B1528] rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-card`.
- Botão **"Sair"** (no Modo Focado — Tela 09): substituir laranja `bg-[#E85D04]` por botão sóbrio `bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-semibold`.
- **3 Ações Principais (`Para Ler (N)` | `Já Lidos (N)` | `Mais`):**
  - Remover `bg-emerald-700` de `Já Lidos` ativa e `dark:bg-[#FBB016]` de `Mais` ativo.
  - Estado ativo (todas as 3): `bg-[#062552] dark:bg-[#03589E] border-2 border-[#062552] dark:border-[#03589E] text-white rounded-xl font-semibold`.
  - Estado inativo: `bg-slate-50 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold`.
- **Submenu "Mais" expandido:**
  - Chips "Filtrar por tipo" (`Todos`, `Visitantes`, `Orações`, `Reuniões`, `Comunicados`): ativo `bg-[#062552] dark:bg-[#03589E] text-white rounded-xl font-semibold`, inativo `bg-slate-50 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl`.
  - Botões "Tamanho da Letra" (`Padrão` / `Grande`): ativo `bg-[#062552] dark:bg-[#03589E] text-white rounded-xl`, inativo `bg-slate-50 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl`.
  - Botão **"Tela Cheia" / "Sair Tela Cheia"**: remover laranja `bg-[#E85D04]`; usar neutro ou `bg-[#062552] text-white` quando ativo e `bg-slate-50 border border-slate-200 rounded-xl` quando inativo.
  - Botão **"Passar Direção"**: `bg-slate-50 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl font-semibold`, ícone `Crown` em `text-[#062552] dark:text-sky-400` (remover laranja/amarelo).
  - Botão **"Encerrar Culto"**: `rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50/70 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-semibold`.

#### `AvisoCardPulpito.tsx` (Telas 08, 09 e 14 — Claro e Noturno)
- **Estrutura do Card (Fim do "Circo de Cores"):**
  - **Remover** a faixa superior preenchida inteira (`visual.headerBg`).
  - Container `<article>`: `rounded-xl border bg-white dark:bg-[#0B1528] border-l-4 transition-all`
    - Pendente normal: `border-slate-200/90 dark:border-slate-800 ${visual.accentBorderLeft} shadow-card`
    - Pendente urgente (`oracao_urgente`): `border-rose-200/90 dark:border-rose-900/70 border-l-[#BE123C] dark:border-l-rose-500 shadow-card`
    - Já lido (`isAnunciado`): `opacity-75 bg-slate-50 dark:bg-[#0B1528]/70 border-slate-200 dark:border-slate-800 border-l-slate-300 dark:border-l-slate-700`
- **Topo Editorial do Card:**
  - Linha superior: `px-4 pt-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2`.
  - Esquerda: `w-7 h-7 rounded-lg ${visual.iconBg} flex items-center justify-center` + `<CategoryIcon className="w-4 h-4 ${visual.iconColor}" />` + label `text-xs font-bold uppercase tracking-wider ${visual.labelColor}` + (se `visual.isUrgent && !isAnunciado`) selo `URGENTE` em `px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-200`.
  - Direita: horário discreto `text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1` (sem `bg-black/20`).
- **Corpo de Leitura do Card:**
  - Nome / Título principal: `font-bold text-2xl sm:text-3xl leading-tight text-slate-900 dark:text-white tracking-tight` (substitui `font-black` por `font-bold` para nitidez máxima no escuro e no claro).
  - Sub-badges (`CASAL`, categoria da oração, data da reunião, público): usar `visual.pillBg` discreto com `rounded-lg text-xs font-semibold border`.
  - Lista de metadados (`Veio de...`, `Igreja...`, `Local...`, `Responsável...`): texto `text-base sm:text-lg text-slate-700 dark:text-slate-200`, ícones em `text-slate-400 dark:text-slate-500` (ou `${visual.iconColor}`).
  - Caixa de explicação/observação (`motivo`, `observacao`, `descricao`): **sempre neutra** `p-3.5 rounded-xl bg-slate-50 dark:bg-[#060E1C] border border-slate-200/80 dark:border-slate-800 text-base sm:text-lg text-slate-800 dark:text-slate-100 font-normal leading-relaxed`.
- **Rodapé e Botão de Confirmação:**
  - Divisor: `border-t border-slate-100 dark:border-slate-800`.
  - Remetente: `text-xs font-medium text-slate-500 dark:text-slate-400`, nome do autor em `font-semibold text-slate-700 dark:text-slate-200`.
  - Botão **"Marcar como Lido"**: substituir o botão verde-esmeralda sólido por botão institucional `bg-[#062552] hover:bg-[#03589E] dark:bg-[#03589E] dark:hover:bg-sky-600 text-white font-semibold text-sm sm:text-base rounded-xl px-5 py-2.5 min-h-[48px] shadow-sm`.
  - Botão **"Voltar à Fila"**: `bg-white dark:bg-[#060E1C] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold rounded-xl px-4 py-2.5 min-h-[48px]`.

---

### 2.9 Telas 10 e 11 — Histórico & Modal Escolher Culto (`src/components/historico/HistoricoScreen.tsx`)

- **Card Cabeçalho + Seletor de Culto:**
  - Container: `bg-white dark:bg-[#0B1528] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-card`.
  - Ícone `History`: `p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#062552] dark:text-sky-400`.
  - Botão **"Copiar"**: `bg-[#062552] hover:bg-[#03589E] text-white rounded-xl font-semibold min-h-[40px]` (quando copiado: `bg-emerald-700 text-white`).
  - Botão **"Compartilhar"**: `bg-slate-50 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl`.
  - Botão Seletor de Culto: `rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060E1C] hover:border-[#03589E]`, seta direita em `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500`.
- **Resumo Numérico 2x2 (`Visitantes`, `Orações`, `Reuniões`, `Avisos`):**
  - **Remover** `iconClass` multicolorido (azul, laranja, verde, marinho).
  - Padronizar todos os 4 ícones com `p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#062552] dark:text-sky-300`; container `rounded-xl border border-slate-200 dark:border-slate-800`; número em `font-bold text-slate-900 dark:text-white`.
- **Filtros de Status (`Todos`, `Lidos`, `Faltam`):**
  - Ativo: `bg-[#062552] dark:bg-[#03589E] border-2 border-[#062552] dark:border-[#03589E] text-white rounded-xl font-semibold`.
  - Inativo: `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium`.
- **Lista de Avisos no Histórico:**
  - **Remover** `visual.headerBg` (faixas inteiras vermelha, azul, amarela, verde).
  - Aplicar mesmo card institucional com `rounded-xl border border-slate-200/90 dark:border-slate-800 border-l-4 ${visual.accentBorderLeft} bg-white dark:bg-[#0B1528]`, topo editorial limpo (`px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800`) com ícone, label, status (`Lido`/`Pendente`) e horário em `text-slate-500`.
- **Modal "Escolher Culto" (Tela 11):**
  - Container: `rounded-2xl border border-slate-200 dark:border-slate-800`.
  - Cabeçalho: `bg-[#062552] text-white`, ícone `Church` em `text-sky-200` (remover `#FBB016`).
  - Item selecionado: `border-2 border-[#03589E] bg-[#F0F6FC] dark:bg-[#0D213F] rounded-xl`, círculo check `bg-[#062552] border-[#062552]`.
  - Item inativo: `border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060E1C] rounded-xl`.

---

### 2.10 Telas 12 e 13 — Ajustes & Administração (`SettingsModal.tsx` & `AdminPassModal.tsx`)

#### `SettingsModal.tsx`
- Container modal: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528]`.
- Cabeçalho: `bg-[#062552] text-white`, ícone `SlidersHorizontal` em `text-sky-200` (remover `#FBB016`).
- **Seletor Principal (`Preferências` | `Administração`):**
  - **Remover** `bg-[#E85D04]` (laranja) da aba `Administração`.
  - Ativa (qualquer uma das duas): `bg-[#062552] dark:bg-[#03589E] border-2 border-[#062552] dark:border-[#03589E] text-white rounded-xl font-semibold`.
  - Inativa: `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold`.
- **Aba Preferências (Tela 12):**
  - Bloco "Conectado como": `rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060E1C]`; botão **"Sair"**: `rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1528] hover:border-rose-300 text-slate-700 hover:text-rose-700 font-semibold`.
  - Seção "Tamanho da Letra": container `rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060E1C]`; botões `Padrão (100%)` / `Grande (125%)` -> ativo `bg-[#062552] dark:bg-[#03589E] text-white rounded-xl font-semibold`, inativo `bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 rounded-xl font-semibold`; caixa de exemplo `rounded-lg border border-slate-200`.
  - **Cards `Tema` e `Sons de Aviso`:**
    - **Remover** `border-[#FBB016]` (borda amarela no modo escuro), `text-[#E85D04]` no sol e `bg-emerald-50 border-emerald-400` (cartão verde-menta inteiro no som).
    - Padronizar ambos com `rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#060E1C] text-slate-900 dark:text-white`; ícones em `text-[#062552] dark:text-sky-400` (e `text-slate-400` quando mudo); badge de estado direita `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold` (pode exibir um ponto discreto `w-2 h-2 rounded-full bg-emerald-500` dentro da pill quando som ligado).
  - Card "Instalar na Tela Inicial" (PWA): `rounded-xl border border-slate-200 bg-[#F0F6FC] dark:bg-[#0D213F] text-[#062552] dark:text-white`.
  - Formulário **"Alterar Minha Senha"**: `rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060E1C]`; ícone `KeyRound` em `text-[#062552] dark:text-sky-400` (remover laranja); inputs `rounded-xl border border-slate-300`; botão **"Salvar Minha Nova Senha"** `bg-[#062552] hover:bg-[#03589E] text-white rounded-xl font-semibold`.
- **Aba Administração (Tela 13):**
  - Submenu 4 botões (`Dirigente` | `Obreiros` | `Senha Admin` | `Conexão`):
    - Ativo: `bg-[#062552] dark:bg-[#03589E] border-2 border-[#062552] dark:border-[#03589E] text-white rounded-xl font-semibold` (remover `dark:bg-[#FBB016] dark:text-[#040B16]`).
    - Inativo: `bg-slate-50 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold`.
  - Cards internos (`Definir Dirigente do Culto`, `Novo Obreiro`, `Alterar Senha Administrativa`, `Sincronização Online`): `rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#060E1C]`.
  - Botões de ação (`Atualizar Dirigente`, `Novo Obreiro`, `Cadastrar Obreiro`, `Atualizar Senha`, `Salvar Conexão`): todos padronizados em `bg-[#062552] hover:bg-[#03589E] text-white rounded-xl font-semibold min-h-[48px]`; botão secundário `Importar Lista` em `bg-white dark:bg-[#0B1528] border border-slate-300 dark:border-slate-700 rounded-xl font-semibold`.
  - Badge `Administrador` na lista de obreiros: trocar laranja/creme `bg-[#FFF4E5] text-[#9A3412]` por `bg-[#F0F6FC] dark:bg-[#0D213F] text-[#062552] dark:text-sky-300 border border-[#03589E]/25 rounded-md font-semibold`.

#### `AdminPassModal.tsx`
- Container modal: `rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528]`.
- Cabeçalho: `bg-[#062552] text-white`, ícone `Crown` em `text-sky-200` (remover `#FBB016`).
- Lista de obreiros: selecionado `bg-[#F0F6FC] dark:bg-[#0D213F] border-2 border-[#03589E] dark:border-sky-400 rounded-xl`; inativo `bg-slate-50/70 dark:bg-[#060E1C] border border-slate-200 dark:border-slate-800 rounded-xl`.
- Badge "Atual": trocar creme/laranja por `bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-semibold`.
- Bloco PIN: ícone `KeyRound` em `text-[#062552] dark:text-sky-400` (remover `#E85D04`), input `rounded-xl border border-slate-300`.
- Botão **"Confirmar Novo Dirigente"**: `bg-[#062552] hover:bg-[#03589E] text-white rounded-xl font-semibold min-h-[50px]` (ícone `Crown` `text-white/90`).

---

## 3. Checklist Pormenorizado de Execução e Validação

### Fase 1 — Base, Tokens e Motor Visual
- [ ] Atualizar `index.html` (`bg-[#F8FAFC] text-[#0F172A]`).
- [ ] Atualizar `tailwind.config.js` (tokens `iprb.surface`, `iprb.border`, `iprb.ink` e sombras suaves).
- [ ] Atualizar `src/index.css` (fundo neutro `#F8FAFC` e texto `#0F172A`).
- [ ] Atualizar `src/App.tsx` (container principal com novo fundo neutro claro `#F8FAFC` e escuro `#040B16`).
- [ ] Refatorar `src/utils/avisoVisual.ts` (substituir `headerBg` colorido por `accentBorderLeft`, `iconBg`, `iconColor`, `labelColor`, `boxBg` neutro, `pillBg` discreta e flag `isUrgent`).

### Fase 2 — Chrome de Navegação e Login
- [ ] Atualizar `src/components/auth/LoginScreen.tsx` (trocar `/logo-ipra.png` por `/logo-ipra-emblem.png`, remover badge amarela/laranja do culto ativo, atualizar cards `rounded-2xl border`, inputs `rounded-xl`, checkbox dirigente azul institucional e CTAs `#062552`).
- [ ] Atualizar `src/components/common/Header.tsx` (remover laranja/amarelo no culto ativo e na engrenagem, ajustar botões glass `bg-white/10 border-white/15` e dropdown sóbrio).
- [ ] Atualizar `src/components/common/BottomNav.tsx` (remover amarelo no modo escuro, indicador superior `#062552` / `sky-400`, badge numérica azul `#03589E`).

### Fase 3 — Hub Inicial e Abertura de Culto
- [ ] Atualizar `src/components/home/HomeScreen.tsx` (remover 2º logo duplicado, uniformizar os 4 ícones das métricas, remover caixa laranja "para ler", padronizar badges e CTAs `#062552`).
- [ ] Atualizar `src/components/culto/IniciarCultoModal.tsx` (remover ícone amarelo no topo e cards laranja/creme na lista de dirigentes, padronizar seletores `rounded-xl`).

### Fase 4 — Fluxo de Envio e Edição de Avisos (Diaconia)
- [ ] Atualizar `src/components/diacono/DiaconoDashboard.tsx` (padronizar seletor 2x2 para `#062552` em todas as abas ativas e cabeçalho limpo do formulário).
- [ ] Atualizar `src/components/diacono/FormVisitante.tsx` (bordas `1px`, seletores `#F0F6FC`/`#03589E`, CTA `#062552`).
- [ ] Atualizar `src/components/diacono/FormOracao.tsx` (remover todo `#E85D04`, manter `Pedido Urgente` como único alerta `rose` quando marcado, CTA `#062552`).
- [ ] Atualizar `src/components/diacono/FormReuniao.tsx` (remover todo `emerald-700` de seletores/foco/CTA, padronizar no azul institucional `#062552`/`#03589E`).
- [ ] Atualizar `src/components/diacono/FormAvisoGeral.tsx` (remover destaque amarelo de "Aniversário" e padronizar todos os chips e CTA `#062552`).
- [ ] Atualizar `src/components/diacono/MeusAvisosHoje.tsx` (cards com `border-l-4` e topo editorial sem faixa colorida).
- [ ] Atualizar `src/components/diacono/EditarAvisoModal.tsx` (geometria `rounded-2xl`/`rounded-xl`, seletores e CTA institucionais).

### Fase 5 — Púlpito e Histórico
- [ ] Atualizar `src/components/pulpito/PulpitoScreen.tsx` (remover `emerald-700` de "Já Lidos", `#E85D04` de "Sair"/"Tela Cheia" e `#FBB016` de "Mais", padronizar barra superior e filtros).
- [ ] Atualizar `src/components/pulpito/AvisoCardPulpito.tsx` (remover faixa superior colorida inteira, adotar `border-l-4`, topo editorial limpo, `font-bold` no título, `boxBg` neutra, selo `URGENTE` exclusivo de oração urgente e CTA "Marcar como Lido" em `#062552`/`#03589E`).
- [ ] Atualizar `src/components/historico/HistoricoScreen.tsx` (uniformizar os 4 ícones de resumo, atualizar cards da lista para `border-l-4` sem faixa colorida, limpar modal "Escolher Culto").

### Fase 6 — Ajustes e Administração
- [ ] Atualizar `src/components/configuracoes/SettingsModal.tsx` (remover aba laranja "Administração", remover cartão verde-menta de "Sons de Aviso" e borda amarela de "Tema", remover `#FBB016` no submenu Admin, padronizar CTAs `#062552`).
- [ ] Atualizar `src/components/auth/AdminPassModal.tsx` (remover `#FBB016`/`#E85D04` e badge creme, padronizar seletores e CTA `#062552`).

### Fase 7 — Auditoria Final de Qualidade, Acessibilidade e Build
- [ ] Verificar que **nenhum** componente usa `border-2` em containers neutros de repouso (reservado apenas para estados ativos/selecionados e `border-l-4` de categoria).
- [ ] Verificar que **nenhum** formulário altera sua cor primária por categoria (toda ação primária é `#062552` / `#03589E`).
- [ ] Confirmar que `min-h-[44px]`/`min-h-[48px]`/`min-h-[52px]` foram preservados em todos os botões e controles interativos.
- [ ] Confirmar que `--font-scale` (`100%` e `125%`) continua escalando toda a tipografia (`rem`) sem quebras ou cortes de texto.
- [ ] Testar visualmente todas as telas nos modos **Claro** e **Noturno (Púlpito)**, garantindo contraste WCAG AA+ (mínimo `4.5:1` em textos normais e `3:1` em títulos grandes).
- [ ] Executar `npm run lint` (ou `npx oxlint`) e confirmar **0 erros**.
- [ ] Executar `npm run build` (`tsc -b && vite build`) e confirmar compilação limpa sem erros de TypeScript ou Vite.
