import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_NODES, DEFAULT_STATE, EMPTY_ARTIFACTS } from '../data/seed'
import { loadState, saveState } from '../utils/storage'
import { nowIso, uid } from '../utils/ids'
import { pipelineReply } from '../utils/pipeline'
import type {
  AppSettings,
  CurrentUser,
  DateRange,
  Member,
  NodeId,
  PersistedState,
  Project,
  ProjectStatus,
  Theme,
  ToastItem,
} from '../types'

type NovaContextValue = {
  user: CurrentUser
  setUser: (patch: Partial<CurrentUser>) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  settings: AppSettings
  setSettings: (patch: Partial<AppSettings>) => void
  projects: Project[]
  members: Member[]
  notifications: PersistedState['notifications']
  selectedPlan: string
  setSelectedPlan: (id: string) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toast: ToastItem | null
  notify: (tone: ToastItem['tone'], text: string) => void
  createProject: (input: { name: string; description?: string; status?: ProjectStatus; idea?: string; icon?: string; createdAt?: string }) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  sendCommand: (projectId: string, text: string) => void
  inviteMember: (payload: { name: string; email: string; role: Member['role'] }) => void
  updateMember: (id: string, patch: Partial<Member>) => void
  removeMember: (id: string) => void
  markNotificationsRead: () => void
  addNotification: (title: string, body: string) => void
}

const NovaContext = createContext<NovaContextValue | null>(null)

function cloneState(): PersistedState {
  const loaded = loadState(DEFAULT_STATE)
  return {
    ...DEFAULT_STATE,
    ...loaded,
    user: { ...DEFAULT_STATE.user, ...loaded.user },
    settings: { ...DEFAULT_STATE.settings, ...loaded.settings },
    projects: loaded.projects?.length ? loaded.projects : DEFAULT_STATE.projects,
    members: loaded.members?.length ? loaded.members : DEFAULT_STATE.members,
    notifications: loaded.notifications ?? DEFAULT_STATE.notifications,
    dateRange: loaded.dateRange ?? DEFAULT_STATE.dateRange,
  }
}

export function NovaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(cloneState)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<ToastItem | null>(null)

  useEffect(() => {
    saveState(state)
    document.documentElement.dataset.theme = state.theme
    document.documentElement.style.colorScheme = state.theme
    document.documentElement.classList.toggle('is-compact', state.settings.compact)
  }, [state])

  const notify = useCallback((tone: ToastItem['tone'], text: string) => {
    const item = { id: uid('toast'), tone, text }
    setToast(item)
    window.setTimeout(() => setToast((current) => (current?.id === item.id ? null : current)), 2600)
  }, [])

  const patchState = useCallback((updater: (current: PersistedState) => PersistedState) => {
    setState((current) => updater(current))
  }, [])

  const setUser = useCallback((patch: Partial<CurrentUser>) => {
    patchState((current) => {
      const user = { ...current.user, ...patch }
      return {
        ...current,
        user,
        members: current.members.map((member) =>
          member.email === current.user.email || member.id === 'm-charles' ? { ...member, name: user.name, email: user.email, role: user.role, avatar: user.avatar } : member,
        ),
      }
    })
  }, [patchState])

  const setTheme = useCallback((theme: Theme) => {
    patchState((current) => ({ ...current, theme }))
  }, [patchState])

  const setSettings = useCallback((patch: Partial<AppSettings>) => {
    patchState((current) => ({ ...current, settings: { ...current.settings, ...patch } }))
  }, [patchState])

  const setSelectedPlan = useCallback((id: string) => {
    patchState((current) => ({ ...current, selectedPlan: id }))
  }, [patchState])

  const setDateRange = useCallback((range: DateRange) => {
    patchState((current) => ({ ...current, dateRange: range }))
  }, [patchState])

  const createProject = useCallback(
    (input: { name: string; description?: string; status?: ProjectStatus; idea?: string; icon?: string; createdAt?: string }) => {
      const stamp = input.createdAt ?? nowIso()
      const project: Project = {
        id: uid('prj'),
        name: input.name.trim() || 'Untitled project',
        description: input.description?.trim() || 'New product workspace',
        status: input.status ?? 'DRAFT',
        version: 'v0.1.0',
        icon: input.icon ?? 'auto_awesome',
        createdAt: stamp,
        updatedAt: stamp,
        memberIds: ['m-charles'],
        idea: input.idea?.trim() || input.name,
        events: [
          {
            id: uid('evt'),
            at: nowIso(),
            actor: 'system',
            text: '> 初始化协作进程...\n> 加载系统预设参数 [Technical Minimalist]\n[OK] 所有计算节点已就绪，等待输入指令。',
          },
        ],
        artifacts: { ...EMPTY_ARTIFACTS },
        nodes: DEFAULT_NODES.map((node) => ({ ...node })),
        clusterStatus: 'Optimal',
      }
      patchState((current) => ({ ...current, projects: [project, ...current.projects] }))
      notify('success', 'Project created successfully.')
      return project
    },
    [notify, patchState],
  )

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    patchState((current) => ({
      ...current,
      projects: current.projects.map((project) => (project.id === id ? { ...project, ...patch, updatedAt: nowIso() } : project)),
    }))
    notify('success', 'Project updated.')
  }, [notify, patchState])

  const deleteProject = useCallback(
    (id: string) => {
      patchState((current) => ({ ...current, projects: current.projects.filter((project) => project.id !== id) }))
      notify('warning', 'Project removed.')
    },
    [notify, patchState],
  )

  const sendCommand = useCallback(
    (projectId: string, text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const userEvent = { id: uid('evt'), at: nowIso(), actor: 'user' as const, text: trimmed }
      patchState((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                events: [...project.events, userEvent],
                nodes: project.nodes.map((node) =>
                  node.id === 'PM_Node_01' ? { ...node, status: 'PROCESSING', progress: 12, task: 'Intent parsing' } : node,
                ),
              }
            : project,
        ),
      }))

      const steps: { delay: number; node: NodeId; progress: number }[] = [
        { delay: 600, node: 'PM_Node_01', progress: 100 },
        { delay: 1400, node: 'UX_Architect', progress: 100 },
        { delay: 2200, node: 'UI_Engine', progress: 100 },
        { delay: 3000, node: 'DEV_Compiler', progress: 100 },
      ]

      window.setTimeout(() => {
        setState((current) => {
          const project = current.projects.find((item) => item.id === projectId)
          if (!project) return current
          const result = pipelineReply(trimmed, project)
          return {
            ...current,
            projects: current.projects.map((item) =>
              item.id === projectId
                ? {
                    ...item,
                    events: [...item.events, ...result.events],
                    artifacts: result.artifacts,
                    status: 'ACTIVE',
                    clusterStatus: 'Optimal',
                    updatedAt: nowIso(),
                    nodes: item.nodes.map((node) => ({
                      ...node,
                      status: node.id === 'DEV_Compiler' ? 'IDLE' : 'STANDBY',
                      progress: 100,
                      task: 'Completed',
                    })),
                  }
                : item,
            ),
          }
        })
        notify('success', trimmed.startsWith('/export_json') ? 'Export package ready.' : 'AI generation complete.')
      }, 3200)

      steps.forEach((step) => {
        window.setTimeout(() => {
          setState((current) => ({
            ...current,
            projects: current.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    nodes: project.nodes.map((node) =>
                      node.id === step.node
                        ? { ...node, status: 'PROCESSING', progress: step.progress, task: 'Running' }
                        : node.status === 'PROCESSING'
                          ? { ...node, status: 'IDLE', progress: 100 }
                          : node,
                    ),
                  }
                : project,
            ),
          }))
        }, step.delay)
      })
    },
    [notify, patchState],
  )

  const inviteMember = useCallback(
    (payload: { name: string; email: string; role: Member['role'] }) => {
      const member: Member = {
        id: uid('mem'),
        name: payload.name.trim(),
        email: payload.email.trim(),
        role: payload.role,
        status: 'Invited',
        avatar: '',
        lastActive: nowIso(),
      }
      patchState((current) => ({ ...current, members: [member, ...current.members] }))
      notify('success', `Invite sent to ${member.email}`)
    },
    [notify, patchState],
  )

  const updateMember = useCallback((id: string, patch: Partial<Member>) => {
    patchState((current) => ({
      ...current,
      members: current.members.map((member) => (member.id === id ? { ...member, ...patch } : member)),
    }))
  }, [patchState])

  const removeMember = useCallback(
    (id: string) => {
      patchState((current) => ({ ...current, members: current.members.filter((member) => member.id !== id) }))
      notify('warning', 'Member removed.')
    },
    [notify, patchState],
  )

  const markNotificationsRead = useCallback(() => {
    patchState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    }))
  }, [patchState])

  const addNotification = useCallback((title: string, body: string) => {
    patchState((current) => ({
      ...current,
      notifications: [{ id: uid('n'), title, body, read: false, at: nowIso() }, ...current.notifications],
    }))
  }, [patchState])

  const value = useMemo(
    () => ({
      user: state.user,
      setUser,
      theme: state.theme,
      setTheme,
      settings: state.settings,
      setSettings,
      projects: state.projects,
      members: state.members,
      notifications: state.notifications,
      selectedPlan: state.selectedPlan,
      setSelectedPlan,
      dateRange: state.dateRange,
      setDateRange,
      sidebarOpen,
      setSidebarOpen,
      toast,
      notify,
      createProject,
      updateProject,
      deleteProject,
      sendCommand,
      inviteMember,
      updateMember,
      removeMember,
      markNotificationsRead,
      addNotification,
    }),
    [
      state,
      sidebarOpen,
      toast,
      setUser,
      setTheme,
      setSettings,
      setSelectedPlan,
      setDateRange,
      notify,
      createProject,
      updateProject,
      deleteProject,
      sendCommand,
      inviteMember,
      updateMember,
      removeMember,
      markNotificationsRead,
      addNotification,
    ],
  )

  return <NovaContext.Provider value={value}>{children}</NovaContext.Provider>
}

export function useNova() {
  const ctx = useContext(NovaContext)
  if (!ctx) throw new Error('NovaProvider missing')
  return ctx
}
