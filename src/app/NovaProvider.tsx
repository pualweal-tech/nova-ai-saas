import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { INITIAL_CHATS, MEMBERS } from '../data/mock'

export type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; rich?: boolean }
  | { id: string; role: 'loading' }
  | { id: string; role: 'file'; name: string; meta: string }

export type Member = (typeof MEMBERS)[number]
export type ChatThread = (typeof INITIAL_CHATS)[number] & { messages: ChatMessage[] }

type Toast = { tone: 'success' | 'error'; text: string } | null

type NovaContextValue = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  analysisOpen: boolean
  setAnalysisOpen: (open: boolean) => void
  historyOpen: boolean
  setHistoryOpen: (open: boolean) => void
  newAnalysisOpen: boolean
  setNewAnalysisOpen: (open: boolean) => void
  inviteOpen: boolean
  setInviteOpen: (open: boolean) => void
  chats: ChatThread[]
  activeChatId: string
  setActiveChatId: (id: string) => void
  createAnalysis: (name: string) => string
  sendMessage: (text: string) => void
  members: Member[]
  inviteMember: (payload: { name: string; email: string; role: string }) => void
  updateMemberRole: (email: string, role: string) => void
  selectedPlan: string
  setSelectedPlan: (id: string) => void
  toast: Toast
  notify: (toast: Toast) => void
}

const NovaContext = createContext<NovaContextValue | null>(null)

const seedMessages: ChatMessage[] = [
  {
    id: 'u1',
    role: 'user',
    text: "I've uploaded the Sales_Data_Master.csv file. Can you analyze the Q1 to Q4 revenue trends across our three main regions (NA, EMEA, APAC) and highlight any anomalies?",
  },
  { id: 'f1', role: 'file', name: 'Sales_Data_Master.csv', meta: '24.5 MB · 120k rows' },
  {
    id: 'a1',
    role: 'assistant',
    rich: true,
    text: "I've analyzed the dataset. Overall, global revenue grew by +14.2% year-over-year. Here is the breakdown of revenue trends across NA, EMEA, and APAC for 2023.",
  },
]

function replyFor(prompt: string) {
  if (/emea/i.test(prompt)) {
    return 'EMEA Q3 shows an 18% contraction against a 6% historical band. Supply-chain lag in September is the strongest correlated signal. I recommend joining logistics tickets before you lock the board narrative.'
  }
  if (/forecast/i.test(prompt)) {
    return 'Q4 forecast (base case) is +9.4% sequential, with APAC contributing 61% of incremental revenue. Confidence is 88% given current pipeline coverage.'
  }
  return `Nova finished analyzing “${prompt}”. Key pattern: growth is concentrated in APAC, while EMEA variance remains the primary risk to the annual target.`
}

export function NovaProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [analysisOpen, setAnalysisOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [newAnalysisOpen, setNewAnalysisOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [activeChatId, setActiveChatId] = useState(INITIAL_CHATS[0].id)
  const [chats, setChats] = useState<ChatThread[]>(
    INITIAL_CHATS.map((chat, index) => ({
      ...chat,
      messages: index === 0 ? seedMessages : [],
    })),
  )
  const [members, setMembers] = useState(MEMBERS)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [toast, setToast] = useState<Toast>(null)

  const notify = useCallback((next: Toast) => {
    setToast(next)
    if (next) window.setTimeout(() => setToast(null), 2400)
  }, [])

  const createAnalysis = useCallback((name: string) => {
    const id = `chat-${Date.now()}`
    setChats((current) => [
      {
        id,
        title: name,
        subtitle: 'New analysis',
        group: 'Today',
        context: 'Untitled dataset',
        messages: [],
      },
      ...current,
    ])
    setActiveChatId(id)
    return id
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const userId = `u-${Date.now()}`
      const loadId = `l-${Date.now()}`
      setChats((current) =>
        current.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { id: userId, role: 'user', text: trimmed },
                  { id: loadId, role: 'loading' },
                ],
              }
            : chat,
        ),
      )
      window.setTimeout(() => {
        setChats((current) =>
          current.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: chat.messages
                    .filter((message) => message.id !== loadId)
                    .concat({
                      id: `a-${Date.now()}`,
                      role: 'assistant',
                      text: replyFor(trimmed),
                    }),
                }
              : chat,
          ),
        )
      }, 900)
    },
    [activeChatId],
  )

  const inviteMember = useCallback((payload: { name: string; email: string; role: string }) => {
    setMembers((current) => [
      {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        status: 'Invited',
        lastActive: '—',
        avatar: '',
      },
      ...current,
    ])
    notify({ tone: 'success', text: `Invite sent to ${payload.email}` })
  }, [notify])

  const updateMemberRole = useCallback((email: string, role: string) => {
    setMembers((current) => current.map((member) => (member.email === email ? { ...member, role } : member)))
  }, [])

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      analysisOpen,
      setAnalysisOpen,
      historyOpen,
      setHistoryOpen,
      newAnalysisOpen,
      setNewAnalysisOpen,
      inviteOpen,
      setInviteOpen,
      chats,
      activeChatId,
      setActiveChatId,
      createAnalysis,
      sendMessage,
      members,
      inviteMember,
      updateMemberRole,
      selectedPlan,
      setSelectedPlan,
      toast,
      notify,
    }),
    [
      sidebarOpen,
      analysisOpen,
      historyOpen,
      newAnalysisOpen,
      inviteOpen,
      chats,
      activeChatId,
      createAnalysis,
      sendMessage,
      members,
      inviteMember,
      updateMemberRole,
      selectedPlan,
      toast,
      notify,
    ],
  )

  return <NovaContext.Provider value={value}>{children}</NovaContext.Provider>
}

export function useNova() {
  const ctx = useContext(NovaContext)
  if (!ctx) throw new Error('NovaProvider missing')
  return ctx
}
