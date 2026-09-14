# NOVA 2.0 SYSTEM

Source of truth for product, UX, visual language, and Cursor implementation.

**Visual sources (5 pages)**

| Page | File | Role |
| --- | --- | --- |
| 官网首页 | `NOVA AI - 官网首页 (Premium) v2.png` | Brand, positioning, four-agent model |
| 工作台启动中心 | `NOVA AI - 工作台启动中心 (Premium) v2.png` | Dashboard / idea-to-product entry |
| AI 协作工作空间 | `NOVA AI - AI 协作工作空间 (Premium) v2.png` | Project workspace, execution, artifacts |
| AI 团队管理 | `NOVA AI - AI 团队管理 (Premium) v2.png` | Agent cluster operations |
| 智能分析中心 | `NOVA AI - 智能分析中心 (Premium) v2.png` | Product analytics |

**App chrome language:** English navigation (`Dashboard`, `Projects`, `Analytics`, `Team`, `Templates`, `Settings`, `Billing`). Page titles and AI copy may be Chinese. UI strings live in `src/i18n/locales/`.

---

## 01. Product Definition

### 产品定位

NOVA AI 2.0 is an **AI Product Workspace**: a precision production tool that turns an idea into a shippable product through a specialized Agent team.

It is not a chatbot, not a generic copilot, and not an analytics-only dashboard. From one prompt, NOVA completes product planning, UX architecture, UI design, and code generation.

Tagline (homepage): **让 AI 团队帮助你创造产品.**

Workspace subtitle: **Product Workspace.**

### 产品目标

1. Compress the path from idea → PRD → UX → UI → code into one workspace.
2. Make Agent work visible: status, progress, artifacts, and intervention points.
3. Keep output production-grade: structured PRD, user flows, design tokens, and componentized code.
4. Give teams a control layer: assign goals, review quality, intervene in real time.

### 核心用户

| Persona | Need |
| --- | --- |
| Founder / Product lead | Turn a product idea into a complete architecture without assembling a full squad |
| Designer | Get IA, flows, and a design system before polishing visuals |
| Engineer | Receive componentized frontend, API hooks, and deployable structure |
| Workspace Admin | Monitor Agent clusters, credits, seats, and output quality |

### 用户痛点

- Idea-to-execution gap: planning, UX, UI, and code live in disconnected tools.
- Chat UIs hide process; users cannot see which Agent is working or why.
- Design systems and code drift after the first draft.
- Teams cannot assign goals, inspect artifacts, or intervene mid-run.

### 核心价值

Describe the idea. NOVA AI builds the product architecture, interface, and logic.

Four sequential Agents own the pipeline:

| Agent | Public name | Cluster node | Job |
| --- | --- | --- | --- |
| Product | Nexus | `PM_Node_01` | Requirements, PRD, personas, roadmap |
| UX | — | `UX_Architect` | IA, interaction logic, user flows, wireframes |
| Design | Aura | `UI_Engine` | Hi-fi UI, design system, motion |
| Code | Cipher | `DEV_Compiler` | Componentized frontend, API, deploy |

---

## 02. Product Principles

### 产品原则

1. **Idea in, product out.** The primary action is creation, not browsing metrics.
2. **Agents are the team.** Human users direct; Agents execute specialized stages.
3. **Artifacts over chat.** Every run produces PRD, User Flow, Design System, and Code.
4. **Visible production.** Status, progress, version, and cluster health are always on screen.
5. **Intervene anytime.** Users can pause, refine, re-run a node, or export.

### AI原则

1. Specialized nodes over one general model. Do not collapse Product / UX / Design / Code into a single reply.
2. Sequential handoff: Product → UX → Design → Code. A later node does not start until the prior artifact is structured.
3. Show intent parsing, module partitioning, semantic positioning, and state definition before generating UI or code.
4. Ground output in project context and memory. Do not invent a new product on every message.
5. Disclose uncertainty. Cluster status, confidence, and failure states must be readable.
6. Never pretend to be a casual chat. Tone is precise, operational, and production-oriented.

### UX原则

1. One primary creation surface on Dashboard. Secondary pages support, they do not compete.
2. Three-column workspace is the core craft view: Agents | Execution | Artifacts.
3. Status is a first-class object: `IDLE` / `STANDBY` / `PROCESSING` / `DEPLOYING` / `ACTIVE` / `DRAFT`.
4. English chrome, bilingual content. Do not mix languages inside a single control label.
5. Empty, loading, and error states are designed, not leftover.

### 设计原则

1. Dark precision tool. Deep black canvas, thin low-contrast borders, electric blue action.
2. Blue-purple operational tone. No playful chatbot bubbles as the default canvas.
3. Generous negative space. Density lives in data, not in chrome.
4. Linear outline icons. Fill only the active nav item.
5. Radius is restrained (4–16px). No heavy drop shadows on page surfaces.
6. Primary `#0050CB` is the only action blue. Do not introduce a second brand hue.

---

## 03. Information Architecture

App shell: left sidebar + top bar + main.

**Sidebar brand**

- Mark: 32×32 blue square with stylized N / spark
- Title: `NOVA AI`
- Subtitle: `Product Workspace`

**Primary nav** (order is fixed)

| Route | Label | Icon | Source page |
| --- | --- | --- | --- |
| `/` | Dashboard | `dashboard` | 工作台启动中心 |
| `/projects` | Projects | `folder_open` | AI 协作工作空间 |
| `/analytics` | Analytics | `insights` | 智能分析中心 |
| `/team` | Team | `group` | AI 团队管理 |
| `/templates` | Templates | `dashboard_customize` | App IA (not in the 5 pages; required) |
| `/billing` | Billing | `credit_card` | App IA (not in the 5 pages; required) |
| `/settings` | Settings | `settings` | App IA |

**Sidebar footer**

- Support
- Documentation
- Current user → Settings

**Marketing site (out of app shell)**

- Logo `NOVA AI`
- 产品 / 解决方案 / 价格 / 文档
- 登录 + 开始创建 → `/`

Do not add, remove, or reorder primary nav items without updating this document.

---

## 04. Core Functions

### AI Assistant

Dashboard hero: **你想创造什么？**

Subcopy: describe the idea; NOVA builds architecture, interface, and logic.

Composer:

- Multiline prompt (example: AI fitness coach App)
- Attach / Voice / Settings
- Primary submit: `NOVA` + rocket
- Submit creates a project and opens `/projects` workspace

### Project Workspace

Three columns, full viewport:

| Column | Width token | Content |
| --- | --- | --- |
| Agent cluster | `--history-width` / `w-72` (~288px) | Product / UX / Design / Code nodes |
| Execution terminal | `flex-1` | Live protocol, progress, composer |
| Artifact panel | `--analysis-width` target 420px | Tabs: PRD, User Flow, Design System, Code |

Quick commands: `/analyze`, `/refine_ui`, `/export_json`.

Footer: `Cluster Status: Optimal` (or degraded / error).

### AI Memory

Per-project memory of: original idea, parsed intent, module map, semantic positions, state definitions, accepted artifacts, user refinements.

Memory is scoped to the active project. Switching projects switches memory.

### Knowledge Base

Project files, generated specs, uploaded references, and export packages. Attach from Dashboard composer or workspace. Knowledge is retrieved into Agent context, not dumped into chat.

### Templates

Starter product briefs that prefill Dashboard prompt + Agent pipeline.

Seed categories aligned to recent-project examples: Fitness, Travel, Wallet / Fintech, plus Writing, Marketing, Design, Development, Research, Automation.

Using a template creates a project and opens workspace.

### Collaboration

Two layers:

1. **Human:** invite, roles (Admin, Project Manager, AI User, Viewer, Developer, Designer), activity.
2. **Agent cluster:** assign strategic goals, review output, intervene in running nodes.

Team page headline: **AI 团队管理**. Eyebrow: `SYSTEM CORE`.

### Analytics

Page title: **AI 产品智能分析**.

Subtitle: **NOVA AI 2.0 智能分析中心 - 实时监控与洞察**.

Default metrics:

| Metric | Example | Meaning |
| --- | --- | --- |
| 项目创建数量 | 12, ↑15% | Projects created |
| Agent Statistics | 248, ↑32% | Agent runs |
| 节省时间 | 86h 本月累计 | Time saved |
| 生成资产 | 326, ↑8% | Generated artifacts |

Team live strip: lines of code today, UI instantiations, requirement-parse success rate, `Live Sync`.

---

## 05. User Flows

### 新建项目

```
Landing 开始创建  →  Dashboard
                 →  type idea (or pick template)
                 →  attach optional files
                 →  submit NOVA
                 →  project created (DRAFT)
                 →  /projects workspace
                 →  PM_Node_01 starts intent parsing
```

### AI任务

```
Team or Workspace  →  + New Task / assign goal
                   →  target Agent (Nexus / Aura / Cipher / UX)
                   →  node PROCESSING
                   →  progress (module / semantic / state)
                   →  artifact written to right panel
                   →  user Accept / Refine / Re-run
```

### 项目协作

```
Team  →  Invite member (human)
      →  role + project scope
      →  member sees artifacts, can comment / assign Agent tasks
Admin →  intervene running node
Viewer →  read-only dashboards and artifacts
```

### AI生成

```
User instruction
  → PM_Node_01 intent parse + structural decompose
  → progress: Module Partitioning / Semantic Positioning / State Definition
  → handoff UX_Architect (flows)
  → handoff UI_Engine (tokens + components)
  → handoff DEV_Compiler (code + deploy)
  → artifacts: PRD | User Flow | Design System | Code
```

Sequential. Do not skip nodes unless the user explicitly re-runs a later stage with existing artifacts.

### 文件管理

Attach on Dashboard or workspace. Files become project context (`Context Active: filename`). Export via `/export_json` or artifact Code tab. Download / Share in workspace header.

### 项目完成

All four artifacts accepted → version bump (e.g. `v1.2.0`) → status `ACTIVE` → appears in Dashboard 最近项目. Optional Cipher deploy. Analytics increments 生成资产 / 节省时间.

---

## 06. Page Specifications

Shared chrome: sidebar 256px (`--sidebar-width`), top bar 64px (`--topbar-height`), content max 1280px on list pages (`--content-max`). Search, notifications, help, avatar on the top bar.

### Dashboard `/`

**Purpose:** Launch creation. Not a revenue dashboard.

| Zone | Spec |
| --- | --- |
| Hero | `你想创造什么？` + supporting line |
| Composer | Large bordered textarea, attach / mic / sliders, `NOVA` rocket CTA |
| Recent | `最近项目` + `查看全部` → `/projects` |
| Project card | Icon, title, `ACTIVE` (green) or `DRAFT` (gray), version, relative time |

Example cards from source: AI fitness coach, travel product, wallet product.

Do not restore the old analytics-welcome metrics (Total Revenue, Transactions) on this route.

### Projects `/projects`

**Purpose:** Craft surface. Full-height workspace, no standard page header.

| Zone | Spec |
| --- | --- |
| Left | Agent nodes: `PM_Node_01`, `UX_Architect`, `UI_Engine`, `DEV_Compiler`. Status `IDLE` / `STANDBY` / processing. |
| Center | Execution terminal, user as Admin, progress bars, command input |
| Right | Tabs PRD · User Flow · Design System · Code. Code preview is generated product code, not Nova app source. |
| Header | Project title, context pill, download / share |

### Analytics `/analytics`

**Purpose:** Monitor product-creation health.

| Zone | Spec |
| --- | --- |
| Title | AI 产品智能分析 |
| Subtitle | NOVA AI 2.0 智能分析中心 - 实时监控与洞察 |
| Metrics | 4 cards: 项目创建数量, Agent Statistics, 节省时间, 生成资产 |
| Trend | Optional range (daily / weekly / monthly) |
| Activity | Recent Agent jobs, model, status, time |

### Team `/team`

**Purpose:** Operate the Agent cluster (primary) and human members (secondary).

| Zone | Spec |
| --- | --- |
| Eyebrow | SYSTEM CORE |
| Title | AI 团队管理 |
| Actions | Search `Search team members or tasks...`, `Task Log`, `+ New Task` |
| Agent cards | Nexus / Aura / Cipher (and UX node when shown) |
| Card anatomy | Name, role, status tag, capability pills, last task or progress bar |
| Bottom | 团队协同状态流 + Live Sync + 3 stats |

Status colors: `IDLE` emerald, `PROCESSING` orange, `DEPLOYING` green.

### Templates `/templates`

Grid of product-creation starters. Category chips. Featured hero. Preview modal → Use Template → new project → workspace.

### Settings `/settings`

Sections (order fixed): Account, Workspace, AI Preferences, Appearance, Notifications, Security, Billing.

AI Preferences must include default Agent, auto-handoff, and memory retention. Appearance defaults to dark Product Workspace.

### Billing `/billing`

Plans: Free / Pro / Enterprise. Track seats and AI credits. Invoices + payment method. Confirm before plan change.

---

## 07. AI System

### AI能力

| Node | Capabilities |
| --- | --- |
| Nexus / Product | Market analysis, requirement planning, persona mining, PRD structure |
| UX_Architect | User flows, interaction logic, wireframes, IA |
| Aura / UI_Engine | UX/UI, design system, animation prototyping, component specs |
| Cipher / DEV_Compiler | React + CSS (or generated Tailwind in **artifact** code), API wiring, Docker / env deploy, interface debug |

Generated artifact code may use Tailwind. The Nova app itself uses CSS files + tokens — do not convert the Nova app to Tailwind because an artifact preview shows it.

### AI输入

- Natural language idea (Dashboard)
- Slash commands (`/analyze`, `/refine_ui`, `/export_json`)
- File attachments
- Voice
- Template seed
- Explicit node assignment from Team

### AI输出

Always artifacts, then optional narrative:

1. PRD
2. User Flow
3. Design System (tokens + components)
4. Code (`generated_layout.tsx` and related)

Plus status, progress, and cluster health.

### Context

Active project, attached files, accepted artifacts, selected Agent, user role. Show `Context Active: {filename}` in workspace header.

### Memory

Project-scoped. Persist idea, parse tree, module map, token decisions, rejected alternatives. Do not leak across projects.

### Actions

`analyze` · `refine_ui` · `export_json` · accept artifact · re-run node · assign task · intervene / pause · deploy.

### Permissions

| Role | AI | Projects | Team | Billing |
| --- | --- | --- | --- | --- |
| Admin | Full, intervene | All | Invite + roles | Full |
| Project Manager | Run + assign | Create + manage | Invite to projects | View |
| Developer / Designer | Run assigned nodes | Assigned | View | — |
| AI User | Run in assigned projects | Assigned | View | — |
| Viewer | Read artifacts | Read | — | — |

---

## 08. Design System

Implementation: `src/styles/tokens.css`. Use CSS variables only. No raw hex in components except inside token definitions.

### Color

**Product Workspace (source pages — dark)**

| Token | Value | Use |
| --- | --- | --- |
| Background | `#131313` | App canvas |
| Surface elevated | `#121212` | Sidebar, cards, composer |
| Page black | `#0A0A0A` – `#000000` | Marketing / deepest canvas |
| Primary | `#0050CB` | CTA, logo mark, active accents |
| Primary container | `#0066FF` | Hover of primary |
| On primary | `#FFFFFF` | Text on blue |
| On surface | `#FFFFFF` | Headings |
| On surface variant | gray ~ `#9AA0A6` | Subcopy, placeholders |
| Outline | thin white/10–15% | Card and input borders |
| Success / IDLE | emerald | Active, idle, paid, up-trend |
| Warning / PROCESSING | orange `#C47B16` range | In-progress |
| Error | `#BA1A1A` | Failed, destructive |
| Overlay | `rgba(25, 28, 29, 0.2)` | Modal / mobile nav |

Current `tokens.css` still encodes a light shell. New UI must map to the dark values above (update tokens, not scatter hex). Keep `--color-primary: #0050cb`.

Soft surfaces: mix primary / success / error / warning at ~10–14% on transparent.

### Typography

| Token | Size | Use |
| --- | --- | --- |
| `--font-body` | Inter, Arial, sans-serif | Body |
| `--font-label` | Geist, Inter, Arial, sans-serif | Controls, nav, labels |
| `--font-mono` | Geist, ui-monospace | Terminal, code, versions |
| `--text-page` | 32px | Page / hero titles |
| `--text-heading` | 20px | Section titles, metric values (may go larger for KPI) |
| `--text-body` | 14px / 1.5 | Body |
| `--text-label` | 12px | Nav, buttons, chips |
| `--text-micro` | 10px | Eyebrows (`SYSTEM CORE`) |
| `--text-legend` | 11px | Chart legend |

Hero title on Dashboard and marketing may use 32px+ with tight tracking. Metric numerals are bold white.

### Spacing

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 16px |
| `--space-4` | 24px |
| `--space-5` | 40px |
| `--space-chart` | 32px |
| `--space-notify` | 12px |

Page padding: `--space-5` desktop, `--space-3` mobile. Card padding: `--space-3`.

### Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 4px | Logo mark, bar tops, small chips |
| `--radius-md` | 8px | Buttons, inputs, nav active, most cards |
| `--radius-lg` | 16px | Large panels, metric cards |
| `--radius-pill` | 9999px | Status live badge, marketing live pill |

### Shadow

Surfaces are flat (border, not shadow).

| Token | Use |
| --- | --- |
| `--shadow-popover` | `0 12px 28px rgba(25, 28, 29, 0.12)` popovers, mobile drawers only |

No page-level drop shadows. No glow except the marketing hero radial blue.

### Icon

Material Symbols Outlined, 20px, weight 400. `FILL 0` default, `FILL 1` for active nav and AI avatar.

Linear, thin-stroke, consistent with source pages. Do not mix filled decorative icon sets.

### Grid

| Region | Spec |
| --- | --- |
| Sidebar | `--sidebar-width: 256px` |
| Top bar | `--topbar-height: 64px` |
| Content | `--content-max: 1280px` |
| Workspace | `h-screen w-full` flex/grid |
| Agent column | ~288px (`w-72`) |
| Artifact column | 420px (token `--analysis-width`, currently 360px — align toward 420 when implementing workspace) |
| Execution | `flex-1`, min 520px desktop |
| Metrics | 4 columns → 2 → 1 |
| Agent cards | 3 columns |
| Page gap | `--space-3` |

---

## 09. Component System

Implement in `src/components/ui.tsx` + `layout.tsx`. Reuse; do not duplicate.

### Navigation

- Sidebar links: 8px / 16px pad, `--radius-md`, hover surface-high, active secondary-container + on-primary (or dark-theme equivalent highlight).
- Active: filled icon + highlight. Scale 0.95 on `:active`.
- Top bar: search, language, bell, help, avatar.
- Marketing header is a separate pattern (centered links, ghost login, blue CTA).

### Button

| Variant | Style |
| --- | --- |
| Primary | `#0050CB`, white label, optional icon (rocket, +, arrow) |
| Secondary / ghost outline | Transparent, 1px outline, white label (Watch Demo, Task Log) |
| Ghost | No border, variant text |
| Danger | Error color, no solid red fill by default |
| Icon | 4px pad, variant color on hover |

Height from 8px / 16px padding. Loading: spinner, `disabled`. Full width allowed in sidebar.

### Input

Dark field, thin outline, `--radius-md`. Search has leading search icon. Composer is a large textarea with tool row (attach, mic, sliders) and trailing primary action. Labels use `--text-label`.

### Card

Dark elevated surface, 1px outline, `--radius-md` to `--radius-lg`. Optional header + divider.

Patterns: metric card, project card, Agent card (icon, title, capability pills, status, progress), template card.

### Table

`.data-table` in a `.table-wrap`. Row height `--row-height: 56px`. Used for invoices, members, AI activity — not for Agent cluster (cards).

### Modal

Overlay + dialog, Escape and backdrop close. Title + close + body + footer (ghost cancel, primary confirm). Invite member, new project, plan change, template preview.

### Toast

Fixed bottom-right, 24px. Success / error. Auto-dismiss ~2400ms. Do not stack unbounded.

### AI Components

| Component | Behavior |
| --- | --- |
| AgentNodeCard | Name, node id, status tag, capabilities, last output or progress |
| ExecutionTerminal | Protocol log, Admin vs node, monospace allowed |
| ProgressSteps | Module Partitioning / Semantic Positioning / State Definition |
| ArtifactTabs | PRD / User Flow / Design System / Code |
| ComposerNOVA | Dashboard creation box |
| ClusterStatus | Optimal / degraded / error |
| SlashCommand | `/analyze` `/refine_ui` `/export_json` |
| StatusBadge | IDLE, PROCESSING, DEPLOYING, ACTIVE, DRAFT, STANDBY |
| LiveSync | Pulsing green + label |

---

## 10. Interaction Rules

`--transition: 200ms ease`.

### Hover

Raise background one surface step. Primary button → `--color-primary-container`. Icon buttons pick up primary color. Cards: background / border only, no lift shadow. Nav: surface-high.

### Active

Buttons `scale(0.98)`, nav `scale(0.95)`. Pressed nav / tab uses selected fill. Metric card `--active` state.

### Loading

Button spinner. Workspace: `Nova is analyzing` + typing dots. Agent: `PROCESSING` + determinate progress (e.g. Aura 65%, Cipher 90%). Segmented bars for parse stages. Never block the whole app with a blank screen.

### Empty

Centered icon + one sentence + optional CTA.

Examples: no projects → prompt to create; no search hits → say so; empty workspace thread → ask for the product idea.

### Error

`--color-error` text or `--color-error-soft` surface. Inline form errors. Toast for failed Agent runs. Node status must show failure, not hang on PROCESSING.

### Success

Green badge / trend / toast (`Invite sent`, save confirmation). `ACTIVE` and paid invoices use success tone.

### Confirmation

Modal for: plan change, destructive member actions, deploy, overwrite of accepted artifact. Primary confirm + ghost cancel. Enter submits only when the primary is focused; Escape cancels.

---

## 11. Responsive Rules

| Breakpoint | Shell | Content | Workspace |
| --- | --- | --- | --- |
| ≥ 1200px | Sidebar persistent | 4 metric columns, 3 Agent cards | 3 columns (agent / execution / artifacts) |
| 1024–1199 | Sidebar persistent | 2 metric columns; charts / team / billing stack | Workspace columns compress (280 / 1fr / 320) |
| 768–1023 | Sidebar persistent; hide header tabs | Single column layouts | Artifacts become overlay drawer |
| ≤ 767 | Sidebar off-canvas + overlay; menu button | 1 column; hide top search | History overlay; `100dvh`; no sidebar margin |

Touch targets ≥ 40px. Composer tools wrap; primary `NOVA` stays visible. Do not shrink Agent cards below readable status tags.

---

## 12. Accessibility

- `:focus-visible` 2px primary outline, 2px offset (`global.css`).
- Icon-only controls have `aria-label`.
- Active nav: `aria-current="page"`.
- Modal: `role="dialog"` `aria-modal="true"`, Escape closes.
- Switch: `role="switch"` + `aria-checked`.
- Progress: `role="progressbar"` with value min/max.
- Status is never color-only (tag text + color).
- `.sr-only` for non-visual labels.
- Images: empty alt on decorative logo; named alt on avatars.
- Do not remove focus rings to “match the mock.”
- Language switcher updates `document.documentElement.lang`.
- Motion: existing 200ms transitions; no additional large parallax.

---

## 13. Technical Architecture

### Frontend

| Piece | Choice |
| --- | --- |
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Entry | `src/main.tsx` → `App.tsx` |
| Routing | `src/app/router.tsx` (path-based) |
| State | `src/app/NovaProvider.tsx` |
| UI | `src/components/ui.tsx`, `layout.tsx` |
| Pages | `src/pages/*Page.tsx` |
| Styles | `tokens.css` → `global.css` `shell.css` `ui.css` `pages.css` `workspace.css` |
| i18n | i18next + `src/i18n/locales/en.json` + `zh-CN.json` |
| Icons | Material Symbols Outlined |
| Lint | Oxlint |

Generated **product** code in the artifact panel may be React + Tailwind. That is output, not Nova’s own stack.

### Backend

No production backend in this repo. Agent runs, billing, and auth are client-mocked. Future API should wrap: projects, Agent jobs, artifacts, members, billing, files.

### API

Until a server exists, all reads/writes go through `NovaProvider` + `src/data/mock.ts`. Shape requests as if they were REST resources: `Project`, `AgentNode`, `AgentJob`, `Artifact`, `Member`, `Plan`.

Suggested job payload: `{ projectId, node, command, prompt, attachments[] }`.

### Data

Canonical entities:

```
Workspace
  └── Project { id, title, status, version, idea, files[], memory, artifacts{} }
        └── AgentNode { id, name, status, capabilities[], progress }
        └── Message / TerminalEvent
        └── Artifact { prd, userFlow, designSystem, code }
  └── Member { name, email, role, status }
  └── Plan / Invoice
```

Mock seed data stays in `src/data/mock.ts`.

### Authentication

Current: mock session (sidebar + header avatars). Settings Account is local state.

Required later: login from marketing 登录, session, role from Team, billing entitlement. Viewer cannot run Agents. Do not store secrets in the repo.

---

## 14. Development Rules

### Cursor开发规则

1. Read this file before changing product copy, IA, layout, or tokens.
2. Match the 5 source pages for Dashboard, Projects, Team, and Analytics. Templates / Settings / Billing follow this document when a page is missing from the PNGs.
3. Reuse `Button`, `Card`, `Input`, `Modal`, `Table`, `Badge`, `Tabs`, `AppLayout`. Extend `ui.tsx`; do not fork styles.
4. New color / space / type goes into `tokens.css` first.
5. User-visible strings go through i18n (`en` + `zh-CN`). Do not hardcode one language in chrome.
6. Agent pipeline is four nodes, sequential. Do not replace it with a single chat completion UI.
7. Artifact Code tab is generated product code. Do not refactor Nova app files to match that preview stack.
8. Verify UI in the browser after visual or interaction changes.

### 代码规范

- TypeScript strict. Function components.
- CSS classes, not inline style except dynamic chart values.
- Named exports for pages and UI.
- Keep provider methods small; mock replies belong in one helper.
- Oxlint clean. No `any` without a comment.
- File names: `PascalCase` components, `camelCase` hooks/data, kebab-case CSS files as they exist.

### 组件复用

| Need | Use |
| --- | --- |
| Page frame | `AppLayout` / `Header` / `Sidebar` |
| Actions | `Button` variants |
| Surfaces | `Card` |
| Forms | `Input`, `SearchInput`, `Switch`, `Dropdown` |
| Status | `Badge` |
| Overlays | `Modal`, popover patterns in layout |
| Data | `Table`, `Progress`, `ChartContainer` |
| People | `Avatar` |

New AI-only pieces go in `ui.tsx` (or a dedicated file imported by pages), not copy-pasted per page.

### 数据结构

Extend types in `NovaProvider` / `mock.ts`:

- `Project.status`: `DRAFT` | `ACTIVE`
- `AgentNode.status`: `IDLE` | `STANDBY` | `PROCESSING` | `DEPLOYING` | `ERROR`
- `ArtifactTab`: `PRD` | `User Flow` | `Design System` | `Code`

Do not rename `NAV_ITEMS` paths.

### Mock Data

All demo content lives in `src/data/mock.ts` (nav, metrics, members, templates, plans, chats).

Agent demo names: **Nexus**, **Aura**, **Cipher**. Node ids: `PM_Node_01`, `UX_Architect`, `UI_Engine`, `DEV_Compiler`.

Dashboard recent-project examples may include fitness / travel / wallet. Analytics seed: 12 projects, 248 agent runs, 86h saved, 326 assets.

Do not fetch live network data unless a backend is added.

### 不允许修改的内容

Do not change the following unless this document is updated first:

1. Brand: **NOVA AI**, subtitle **Product Workspace**, primary **`#0050CB`**.
2. Four-agent model and public names (Nexus, Aura, Cipher + UX Architect).
3. Primary nav order and routes listed in §03.
4. CSS variable names in `src/styles/tokens.css` (values for dark theme may be updated; names stay).
5. Public props of existing `ui.tsx` components (`variant`, `tone`, etc.). Add; do not rename/break.
6. i18n key map `NAV_PATH_KEYS` and `SUPPORTED_LANGUAGES` (`en`, `zh-CN`).
7. Sequential Agent handoff (Product → UX → Design → Code).
8. Workspace three-zone model (Agents | Execution | Artifacts).
9. Artifact tabs: PRD, User Flow, Design System, Code.
10. Slash commands: `/analyze`, `/refine_ui`, `/export_json`.
11. Status vocabulary: `IDLE`, `STANDBY`, `PROCESSING`, `DEPLOYING`, `ACTIVE`, `DRAFT`.
12. Do not convert the Nova application itself to Tailwind to imitate artifact previews.
13. Do not replace Dashboard creation hero with the old revenue/transactions overview.
14. Do not commit secrets, `.env` credentials, or real payment data.

---

*NOVA 2.0 SYSTEM · Design-system.md · aligned to the five Premium v2 pages and the current `nova-ai` codebase.*
