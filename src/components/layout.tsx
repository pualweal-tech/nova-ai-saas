import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNova } from '../app/NovaProvider'
import { Link, useRouter } from '../app/router'
import { NAV_ITEMS } from '../data/mock'
import { Avatar, Button, Icon, Input, Modal, SearchInput, Tabs } from './ui'

function isActive(path: string, to: string) {
  if (to === '/') return path === '/'
  return path === to || path.startsWith(`${to}/`)
}

export function Sidebar() {
  const { path, navigate } = useRouter()
  const { sidebarOpen, setSidebarOpen, setNewAnalysisOpen } = useNova()

  useEffect(() => {
    setSidebarOpen(false)
  }, [path, setSidebarOpen])

  return (
    <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`} aria-label="Primary navigation">
      <Link to="/" className="brand">
        <span className="brand__mark">
          <img src="/logo.svg" alt="" />
        </span>
        <span>
          <strong>Nova Analytics</strong>
          <small>Enterprise SaaS</small>
        </span>
      </Link>
      <Button
        full
        type="button"
        onClick={() => {
          setNewAnalysisOpen(true)
          setSidebarOpen(false)
        }}
      >
        <Icon name="add" />
        New Analysis
      </Button>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className={`nav-link${isActive(path, item.to) ? ' nav-link--active' : ''}`}>
            <Icon name={item.icon} filled={isActive(path, item.to)} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar__footer">
        <Button full type="button" onClick={() => navigate('/billing')}>
          Upgrade Plan
        </Button>
        <button className="sidebar-user" type="button" onClick={() => navigate('/settings')}>
          <Avatar src="https://i.pravatar.cc/64?img=47" name="Sarah Jenkins" />
          <span>
            <strong>Sarah Jenkins</strong>
            <small>Admin</small>
          </span>
        </button>
        <a className="nav-link nav-link--small" href="#support">
          <Icon name="help_outline" />
          Support
        </a>
      </div>
    </aside>
  )
}

export function Header({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearch,
  tabs,
  tab,
  onTab,
}: {
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  tabs?: string[]
  tab?: string
  onTab?: (value: string) => void
}) {
  const { setSidebarOpen } = useNova()
  const [open, setOpen] = useState<'none' | 'notes' | 'user'>('none')
  const [unread, setUnread] = useState(true)

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen('none')
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="menu-button" type="button" aria-label="Toggle menu" onClick={() => setSidebarOpen(true)}>
          <Icon name="menu" />
        </button>
        {onSearch ? (
          <SearchInput className="search--top" value={searchValue ?? ''} onChange={onSearch} placeholder={searchPlaceholder} />
        ) : null}
      </div>
      {tabs && tab && onTab ? <Tabs items={tabs} value={tab} onChange={onTab} /> : null}
      <div className="topbar__actions">
        <button className="icon-button" type="button" aria-label="Notifications" onClick={() => setOpen(open === 'notes' ? 'none' : 'notes')}>
          <Icon name="notifications" />
        </button>
        <button className="icon-button help-button" type="button" aria-label="Help">
          <Icon name="help_outline" />
        </button>
        <button className="icon-button" type="button" aria-label="Open user menu" onClick={() => setOpen(open === 'user' ? 'none' : 'user')}>
          <Avatar src="https://i.pravatar.cc/64?img=5" name="Jane Doe" />
        </button>
      </div>
      <div className="popover notifications-popover" hidden={open !== 'notes'} role="dialog" aria-label="Notifications">
        <div className="popover__header">
          <strong>Notifications</strong>
          <button className="text-button" type="button" onClick={() => setUnread(false)}>
            Mark all as read
          </button>
        </div>
        <div className="notification-list">
          <button className={`notification${unread ? ' notification--unread' : ''}`} type="button">
            <span className="notification__dot" />
            <span>
              <strong>Revenue report is ready</strong>
              <small>Your monthly performance report has been generated.</small>
            </span>
          </button>
          <button className={`notification${unread ? ' notification--unread' : ''}`} type="button">
            <span className="notification__dot" />
            <span>
              <strong>New team member</strong>
              <small>Olivia Martin joined your workspace.</small>
            </span>
          </button>
        </div>
      </div>
      <div className="popover user-popover" hidden={open !== 'user'} role="dialog" aria-label="User menu">
        <div className="user-summary">
          <strong>Jane Doe</strong>
          <small>jane.doe@nova-analytics.com</small>
        </div>
        <button type="button">
          <Icon name="account_circle" />
          Profile
        </button>
        <button type="button">
          <Icon name="settings" />
          Account settings
        </button>
        <button type="button">
          <Icon name="logout" />
          Sign out
        </button>
      </div>
    </header>
  )
}

export function AppLayout({
  children,
  workspace = false,
  header,
}: {
  children: ReactNode
  workspace?: boolean
  header?: ReactNode
}) {
  const { sidebarOpen, setSidebarOpen, newAnalysisOpen, setNewAnalysisOpen, createAnalysis, toast } = useNova()
  const { navigate } = useRouter()
  const [name, setName] = useState('Untitled analysis')

  return (
    <>
      <Sidebar />
      {sidebarOpen ? <div className="overlay" onClick={() => setSidebarOpen(false)} /> : null}
      {!workspace ? header ?? <Header /> : null}
      <main className={`app-main${workspace ? ' app-main--workspace' : ''}`}>{children}</main>
      {toast ? (
        <div className={toast.tone === 'error' ? 'error-state' : 'success-banner'} style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 50 }}>
          {toast.text}
        </div>
      ) : null}
      <Modal
        open={newAnalysisOpen}
        title="New Analysis"
        onClose={() => setNewAnalysisOpen(false)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setNewAnalysisOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                createAnalysis(name || 'Untitled analysis')
                setNewAnalysisOpen(false)
                navigate('/projects')
              }}
            >
              Create
            </Button>
          </>
        }
      >
        <Input label="Analysis name" value={name} onChange={(event) => setName(event.target.value)} />
        <p className="muted">Starts a new workspace chat. You can attach a dataset after opening the project.</p>
      </Modal>
    </>
  )
}
