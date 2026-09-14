import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNova } from '../app/NovaProvider'
import { Link, useRouter } from '../app/router'
import { NAV_ITEMS } from '../data/seed'
import { NAV_PATH_KEYS } from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Avatar, Icon, SearchInput, ToastStack } from './ui'
import { relativeTime } from '../utils/dates'

function isActive(path: string, to: string) {
  if (to === '/') return path === '/'
  return path === to || path.startsWith(`${to}/`)
}

export function Sidebar() {
  const { path, navigate } = useRouter()
  const { sidebarOpen, setSidebarOpen, user, notify } = useNova()
  const { t } = useTranslation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [path, setSidebarOpen])

  return (
    <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`} aria-label={t('layout.primaryNav')}>
      <Link to="/" className="brand">
        <span className="brand__mark">
          <img src="/logo.svg" alt="" />
        </span>
        <span>
          <strong>NOVA AI</strong>
          <small>{t('layout.brandTagline')}</small>
        </span>
      </Link>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className={`nav-link${isActive(path, item.to) ? ' nav-link--active' : ''}`}>
            <Icon name={item.icon} filled={isActive(path, item.to)} />
            {t(NAV_PATH_KEYS[item.to])}
          </Link>
        ))}
      </nav>
      <div className="sidebar__footer">
        <button className="sidebar-user" type="button" onClick={() => navigate('/settings')}>
          <Avatar src={user.avatar} name={user.name} />
          <span>
            <strong>{user.name}</strong>
            <small className="online-dot">{user.role}</small>
          </span>
        </button>
        <button
          className="nav-link nav-link--small"
          type="button"
          onClick={() => notify('info', 'Support is standing by. Use Help in the header for a product walkthrough.')}
        >
          <Icon name="help_outline" />
          {t('layout.support')}
        </button>
        <Link to="/welcome" className="nav-link nav-link--small">
          <Icon name="description" />
          {t('layout.documentation')}
        </Link>
      </div>
    </aside>
  )
}

export function Header({
  searchPlaceholder,
  searchValue,
  onSearch,
  leading,
  extraActions,
}: {
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  leading?: ReactNode
  extraActions?: ReactNode
}) {
  const { t } = useTranslation()
  const { navigate } = useRouter()
  const { setSidebarOpen, user, notifications, markNotificationsRead } = useNova()
  const [open, setOpen] = useState<'none' | 'notes' | 'user' | 'help'>('none')
  const unread = notifications.some((item) => !item.read)

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
        <button className="menu-button" type="button" aria-label={t('layout.toggleMenu')} onClick={() => setSidebarOpen(true)}>
          <Icon name="menu" />
        </button>
        {leading}
        {onSearch ? (
          <SearchInput className="search--top" value={searchValue ?? ''} onChange={onSearch} placeholder={searchPlaceholder ?? t('layout.searchPlaceholder')} />
        ) : null}
      </div>
      <div className="topbar__actions">
        <LanguageSwitcher />
        {extraActions}
        <button className={`icon-button${unread ? ' icon-button--dot' : ''}`} type="button" aria-label={t('layout.notifications')} onClick={() => setOpen(open === 'notes' ? 'none' : 'notes')}>
          <Icon name="notifications" />
        </button>
        <button className="icon-button help-button" type="button" aria-label={t('layout.help')} onClick={() => setOpen(open === 'help' ? 'none' : 'help')}>
          <Icon name="help_outline" />
        </button>
        <button className="icon-button" type="button" aria-label={t('layout.openUserMenu')} onClick={() => setOpen(open === 'user' ? 'none' : 'user')}>
          <Avatar src={user.avatar} name={user.name} />
        </button>
      </div>
      <div className="popover notifications-popover" hidden={open !== 'notes'} role="dialog" aria-label={t('layout.notifications')}>
        <div className="popover__header">
          <strong>{t('layout.notifications')}</strong>
          <button className="text-button" type="button" onClick={markNotificationsRead}>
            {t('layout.markAllAsRead')}
          </button>
        </div>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="muted" style={{ padding: 12 }}>No notifications.</p>
          ) : (
            notifications.map((item) => (
              <button key={item.id} className={`notification${!item.read ? ' notification--unread' : ''}`} type="button">
                <span className="notification__dot" />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.body} · {relativeTime(item.at)}
                  </small>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="popover help-popover" hidden={open !== 'help'} role="dialog" aria-label="Help">
        <p>NOVA 2.0 Product Workspace. Describe an idea on Dashboard, then inspect Agents, Execution, and Artifacts in Projects.</p>
        <button className="text-button" type="button" onClick={() => navigate('/welcome')}>
          Open marketing site
        </button>
      </div>
      <div className="popover user-popover" hidden={open !== 'user'} role="dialog" aria-label={t('layout.userMenu')}>
        <div className="user-summary">
          <strong>{user.name}</strong>
          <small>{user.email}</small>
        </div>
        <button type="button" onClick={() => navigate('/settings')}>
          <Icon name="account_circle" />
          {t('layout.profile')}
        </button>
        <button type="button" onClick={() => navigate('/settings')}>
          <Icon name="settings" />
          {t('layout.accountSettings')}
        </button>
        <button type="button" onClick={() => navigate('/welcome')}>
          <Icon name="logout" />
          {t('layout.signOut')}
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
  const { sidebarOpen, setSidebarOpen, toast } = useNova()

  return (
    <>
      <Sidebar />
      {sidebarOpen ? <div className="overlay" onClick={() => setSidebarOpen(false)} /> : null}
      {!workspace ? header ?? <Header /> : header}
      <main className={`app-main${workspace ? ' app-main--workspace' : ''}`}>{children}</main>
      <ToastStack toast={toast} />
    </>
  )
}
