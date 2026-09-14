export type Theme = 'dark' | 'light'
export type ProjectStatus = 'DRAFT' | 'ACTIVE'
export type AgentStatus = 'IDLE' | 'STANDBY' | 'PROCESSING' | 'DEPLOYING' | 'ERROR'
export type MemberStatus = 'Active' | 'Inactive' | 'Invited' | 'Offline'
export type Role = 'Admin' | 'Project Manager' | 'Developer' | 'Designer' | 'AI User' | 'Viewer'
export type DatePreset = 'today' | 'yesterday' | '7d' | '30d' | 'custom'
export type ArtifactTab = 'PRD' | 'User Flow' | 'Design System' | 'Code'
export type ToastTone = 'success' | 'error' | 'warning' | 'info'
export type NodeId = 'PM_Node_01' | 'UX_Architect' | 'UI_Engine' | 'DEV_Compiler'
export type Actor = 'system' | 'user' | NodeId

export type DateRange = {
  preset: DatePreset
  start: string
  end: string
}

export type CurrentUser = {
  name: string
  email: string
  role: Role
  title: string
  avatar: string
}

export type AgentNode = {
  id: NodeId
  name: string
  publicName: string
  roleLabel: string
  icon: string
  status: AgentStatus
  capabilities: string[]
  summary: string
  progress: number
  task: string
}

export type TerminalEvent = {
  id: string
  at: string
  actor: Actor
  text: string
}

export type Artifacts = {
  prd: string
  userFlow: string
  designSystem: string
  code: string
}

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  version: string
  icon: string
  createdAt: string
  updatedAt: string
  memberIds: string[]
  idea: string
  events: TerminalEvent[]
  artifacts: Artifacts
  nodes: AgentNode[]
  clusterStatus: 'Optimal' | 'Degraded' | 'Error'
}

export type Member = {
  id: string
  name: string
  email: string
  role: Role
  status: MemberStatus
  avatar: string
  lastActive: string
}

export type TemplateItem = {
  id: string
  title: string
  category: string
  uses: string
  icon: string
  description: string
  prompt: string
}

export type NotificationItem = {
  id: string
  title: string
  body: string
  read: boolean
  at: string
}

export type AppSettings = {
  workspaceName: string
  enforceLimits: boolean
  defaultModel: string
  autoHandoff: boolean
  memoryRetention: boolean
  compact: boolean
  emailAlerts: boolean
  productTips: boolean
  twoFactor: boolean
  slack: boolean
  github: boolean
  figma: boolean
}

export type ToastItem = {
  id: string
  tone: ToastTone
  text: string
}

export type PersistedState = {
  user: CurrentUser
  projects: Project[]
  members: Member[]
  settings: AppSettings
  theme: Theme
  notifications: NotificationItem[]
  selectedPlan: string
  dateRange: DateRange
}
