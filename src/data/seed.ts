import type { AgentNode, AppSettings, CurrentUser, Member, NotificationItem, PersistedState, Project, TemplateItem } from '../types'
import { daysAgo, hoursAgo, rangeFromPreset } from '../utils/dates'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/analytics', label: 'Analytics', icon: 'analytics' },
  { to: '/projects', label: 'Projects', icon: 'folder_copy' },
  { to: '/team', label: 'Team', icon: 'group' },
  { to: '/templates', label: 'Templates', icon: 'dashboard_customize' },
  { to: '/billing', label: 'Billing', icon: 'credit_card' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
] as const

export const DEFAULT_NODES: AgentNode[] = [
  {
    id: 'PM_Node_01',
    name: 'PM_Node_01',
    publicName: 'Nexus',
    roleLabel: 'Product Agent',
    icon: 'psychology',
    status: 'IDLE',
    capabilities: ['市场分析', '需求规划', '用户画像挖掘'],
    summary: '需求解析 / PRD 结构化',
    progress: 0,
    task: '待命',
  },
  {
    id: 'UX_Architect',
    name: 'UX_Architect',
    publicName: 'Helix',
    roleLabel: 'UX Agent',
    icon: 'account_tree',
    status: 'STANDBY',
    capabilities: ['信息架构', '交互逻辑', '线框图'],
    summary: '用户流构建 / 逻辑推演',
    progress: 0,
    task: '待命',
  },
  {
    id: 'UI_Engine',
    name: 'UI_Engine',
    publicName: 'Aura',
    roleLabel: 'Design Agent',
    icon: 'design_services',
    status: 'STANDBY',
    capabilities: ['UX/UI 设计', 'Design System 维护', '动效原型'],
    summary: '设计系统生成 / 组件规范',
    progress: 0,
    task: '待命',
  },
  {
    id: 'DEV_Compiler',
    name: 'DEV_Compiler',
    publicName: 'Cipher',
    roleLabel: 'Developer Agent',
    icon: 'code_blocks',
    status: 'STANDBY',
    capabilities: ['代码生成 (React)', '自动化部署', '接口调试'],
    summary: '代码转译 / 架构实现',
    progress: 0,
    task: '待命',
  },
]

export const EMPTY_ARTIFACTS = {
  prd: '尚未生成 PRD。向执行终端发送指令，或使用 /analyze。',
  userFlow: '尚未生成用户流程。等待 UX_Architect 完成结构化推演。',
  designSystem: '尚未生成设计系统。等待 UI_Engine 提取 tokens。',
  code: '// Generated code will appear here after DEV_Compiler completes.',
}

export const DEFAULT_USER: CurrentUser = {
  name: 'Charles',
  email: 'charles@nova.ai',
  role: 'Admin',
  title: 'System Admin',
  avatar: '',
}

export const DEFAULT_SETTINGS: AppSettings = {
  workspaceName: 'NOVA Product Workspace',
  enforceLimits: true,
  defaultModel: 'Nova-Ultra',
  autoHandoff: true,
  memoryRetention: true,
  compact: false,
  emailAlerts: true,
  productTips: false,
  twoFactor: true,
  slack: false,
  github: true,
  figma: true,
}

export const DEFAULT_MEMBERS: Member[] = [
  { id: 'm-charles', name: 'Charles', email: 'charles@nova.ai', role: 'Admin', status: 'Active', avatar: '', lastActive: hoursAgo(0.1) },
  { id: 'm-sarah', name: 'Sarah Jenkins', email: 'sarah.jenkins@nova.ai', role: 'Project Manager', status: 'Active', avatar: '', lastActive: hoursAgo(2) },
  { id: 'm-mike', name: 'Mike Chen', email: 'mike.chen@nova.ai', role: 'Developer', status: 'Active', avatar: '', lastActive: hoursAgo(5) },
  { id: 'm-elena', name: 'Elena Ruiz', email: 'elena.r@nova.ai', role: 'Designer', status: 'Invited', avatar: '', lastActive: daysAgo(2) },
]

function project(partial: Project): Project {
  return partial
}

export const DEFAULT_PROJECTS: Project[] = [
  project({
    id: 'fitness',
    name: 'AI Fitness Coach',
    description: '视频分析、营养计划和社交分享的 AI 健身教练产品。',
    status: 'ACTIVE',
    version: 'v1.2.0',
    icon: 'fitness_center',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    memberIds: ['m-charles', 'm-sarah'],
    idea: '我想创建一个AI健身教练App，包含视频分析、营养计划和社交分享功能。',
    clusterStatus: 'Optimal',
    nodes: DEFAULT_NODES.map((node) => ({ ...node, status: node.id === 'PM_Node_01' ? 'IDLE' : 'STANDBY' })),
    events: [
      { id: 'e1', at: hoursAgo(2.05), actor: 'system', text: '> 初始化协作进程...\n> 加载系统预设参数 [Technical Minimalist]\n[OK] 所有计算节点已就绪，等待输入指令。' },
      { id: 'e2', at: hoursAgo(2.04), actor: 'user', text: '我想创建一个AI健身教练App，包含视频分析、营养计划和社交分享功能。' },
      { id: 'e3', at: hoursAgo(2.03), actor: 'PM_Node_01', text: '接收到主指令。正在进行意图解析与结构化分解：\n- 模块划分: 训练、营养、社交、视频分析\n- 语义定位: 高精度运动教练，而非泛娱乐社区\n- 状态定义: 会话、计划、记录、分享' },
    ],
    artifacts: {
      prd: '# AI Fitness Coach PRD\n\n## Problem\nUsers cannot get real-time form correction and nutrition planning in one product.\n\n## Modules\n1. Video analysis\n2. Nutrition plans\n3. Social sharing\n4. Coach memory',
      userFlow: 'Landing → Onboarding → Capture form → AI critique → Plan → Share',
      designSystem: 'Background #131313 · Surface #121212 · Primary #0050CB · Success #008259',
      code: 'export const FitnessLayout = () => (\n  <main className="flex h-screen bg-background">\n    <CoachSidebar />\n    <SessionCanvas className="flex-1" />\n    <PlanPanel />\n  </main>\n);',
    },
  }),
  project({
    id: 'travel',
    name: 'Travel Planner AI',
    description: '多目的地行程、预算与实时建议。',
    status: 'DRAFT',
    version: 'v0.9.1',
    icon: 'flight_takeoff',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    memberIds: ['m-charles', 'm-elena'],
    idea: '帮我规划一个多城市旅行产品，含预算和实时建议。',
    clusterStatus: 'Optimal',
    nodes: DEFAULT_NODES.map((node) => ({ ...node })),
    events: [{ id: 't1', at: daysAgo(1), actor: 'system', text: '[OK] Draft workspace ready.' }],
    artifacts: { ...EMPTY_ARTIFACTS },
  }),
  project({
    id: 'finance',
    name: 'Smart Finance App',
    description: '个人财务、账单分类与预测。',
    status: 'DRAFT',
    version: 'v0.5.0',
    icon: 'account_balance_wallet',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    memberIds: ['m-mike'],
    idea: '做一个智能记账与预算预测 App。',
    clusterStatus: 'Degraded',
    nodes: DEFAULT_NODES.map((node) => ({ ...node })),
    events: [{ id: 'f1', at: daysAgo(3), actor: 'system', text: '[WAIT] Awaiting product brief refinement.' }],
    artifacts: { ...EMPTY_ARTIFACTS },
  }),
  project({
    id: 'alpha',
    name: 'Project Alpha Core',
    description: 'AI 协作工作空间核心界面。左侧智能体、中间执行流、右侧产出物。',
    status: 'ACTIVE',
    version: 'v1.0.4',
    icon: 'hub',
    createdAt: daysAgo(8),
    updatedAt: hoursAgo(4),
    memberIds: ['m-charles', 'm-sarah', 'm-mike'],
    idea: '设计一个“AI 协作工作空间”的核心界面。需要包含左侧智能体列表、中间执行对话流和右侧产出物面板。风格要像精密的生产工具，非聊天机器人。使用蓝紫色调。',
    clusterStatus: 'Optimal',
    nodes: DEFAULT_NODES.map((node) =>
      node.id === 'UI_Engine' ? { ...node, status: 'PROCESSING', progress: 65, task: '编译设计系统中...' } : node,
    ),
    events: [
      { id: 'a1', at: hoursAgo(4.1), actor: 'system', text: '> 初始化协作进程...\n> 加载系统预设参数 [Technical Minimalist]\n[OK] 所有计算节点已就绪，等待输入指令。' },
      { id: 'a2', at: hoursAgo(4), actor: 'user', text: '设计一个“AI 协作工作空间”的核心界面。需要包含左侧智能体列表、中间执行对话流和右侧产出物面板。风格要像精密的生产工具，非聊天机器人。使用蓝紫色调。' },
      { id: 'a3', at: hoursAgo(3.98), actor: 'PM_Node_01', text: '接收到主指令。正在进行意图解析与结构化分解：\n- 模块划分: 三栏式固定布局 (Nav + Main Content [Left, Center, Right])\n- 语义定位: 高级生产力工具，排除传统 Chat UI 的气泡样式。\n- 状态定义: 需体现 Agent 的并行或序列工作状态。\nPRD 框架已同步至产出物面板。请求 UI_Engine 介入。' },
      { id: 'a4', at: hoursAgo(3.9), actor: 'UI_Engine', text: '_ 编译设计系统中... 提取 Tokens: background, surface-elevated, border-subtle, primary.' },
    ],
    artifacts: {
      prd: '# Workspace PRD\nPrecision production tool. Four sequential agents. Artifacts over chat.',
      userFlow: 'Idea → Parse → UX → UI tokens → Code → Export',
      designSystem: 'Background #131313\nSurface Elevated #121212\nPrimary Container #0050CB',
      code: `export const WorkspaceLayout = () => {
  return (
    <main className="flex h-screen w-full bg-background">
      <AgentSidebar />
      <ExecutionConsole className="flex-1" />
      <ArtifactPanel />
    </main>
  );
};`,
    },
  }),
]

export const TEMPLATES: TemplateItem[] = [
  { id: 'writer', title: 'AI Content Writer', category: 'Writing', uses: '12k', icon: 'edit_note', description: 'Draft long-form articles and on-brand copy.', prompt: 'Create a content operating system for a B2B SaaS brand.' },
  { id: 'campaign', title: 'Marketing Campaign Generator', category: 'Marketing', uses: '18k', icon: 'campaign', description: 'Multi-channel campaign plans and calendars.', prompt: 'Build a launch campaign planner with ads, email, and landing pages.' },
  { id: 'fitness-tpl', title: 'AI Fitness Coach', category: 'Automation', uses: '9.1k', icon: 'fitness_center', description: 'Video analysis, nutrition, and social loops.', prompt: '我想创建一个AI健身教练App，包含视频分析、营养计划和社交分享功能。' },
  { id: 'travel-tpl', title: 'Travel Planner', category: 'Research', uses: '7.4k', icon: 'flight_takeoff', description: 'Itineraries, budgets, and live suggestions.', prompt: '帮我规划一个多城市旅行产品，含预算和实时建议。' },
  { id: 'wallet', title: 'Smart Finance App', category: 'Development', uses: '11k', icon: 'account_balance_wallet', description: 'Budgets, categorization, and forecasts.', prompt: '做一个智能记账与预算预测 App。' },
  { id: 'ui', title: 'UI Design Critic', category: 'Design', uses: '7.1k', icon: 'palette', description: 'Review hierarchy, accessibility, and consistency.', prompt: 'Build a UI critique agent that outputs a design-system patch list.' },
]

export const TEMPLATE_CATEGORIES = ['All', 'Writing', 'Marketing', 'Design', 'Development', 'Research', 'Automation']

export const PLANS = [
  { id: 'free', name: 'Free', price: '$0', cadence: '/mo', copy: 'For individuals exploring AI product creation.', features: ['1 workspace', '50k AI credits', 'Community support'], cta: 'Select Free' },
  { id: 'pro', name: 'Pro', price: '$49', cadence: '/mo', copy: 'For professional teams scaling AI workflows.', features: ['Unlimited projects', '1M AI credits', 'Priority support', 'Advanced analytics'], cta: 'Upgrade to Pro', featured: true },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', cadence: '', copy: 'For organizations that need SSO and audit trails.', features: ['Everything in Pro', 'SSO and audit logs', 'Dedicated success manager'], cta: 'Contact Sales' },
]

export const INVOICES = [
  { date: 'Jul 24, 2026', amount: '$49.00', status: 'PAID' },
  { date: 'Jun 24, 2026', amount: '$49.00', status: 'PAID' },
  { date: 'May 24, 2026', amount: '$49.00', status: 'PAID' },
  { date: 'Apr 24, 2026', amount: '$49.00', status: 'PAID' },
]

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Aura completed design tokens', body: 'Project Alpha Core design system is ready to apply.', read: false, at: hoursAgo(0.4) },
  { id: 'n2', title: 'Cipher deploying', body: 'PR #4092 is 90% through docker compose.', read: false, at: hoursAgo(1) },
  { id: 'n3', title: 'Nexus finished PRD', body: 'Q4 requirements document generated.', read: true, at: hoursAgo(10) },
]

export const DEFAULT_STATE: PersistedState = {
  user: DEFAULT_USER,
  projects: DEFAULT_PROJECTS,
  members: DEFAULT_MEMBERS,
  settings: DEFAULT_SETTINGS,
  theme: 'dark',
  notifications: DEFAULT_NOTIFICATIONS,
  selectedPlan: 'pro',
  dateRange: rangeFromPreset('30d'),
}

export const SETTINGS_SECTIONS = [
  'General',
  'Profile',
  'AI Preferences',
  'Notifications',
  'Appearance',
  'Integrations',
  'Security',
  'Members',
] as const

export const ROLE_OPTIONS: Member['role'][] = ['Admin', 'Project Manager', 'Developer', 'Designer', 'AI User', 'Viewer']
