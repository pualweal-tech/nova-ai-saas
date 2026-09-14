import { useRef, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Avatar, Button, Card, Input, Switch } from '../components/ui'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { SETTINGS_SECTIONS } from '../data/seed'
import { useNova } from '../app/NovaProvider'
import { useRouter } from '../app/router'
import type { AppSettings } from '../types'

export function SettingsPage() {
  const { user, setUser, settings, setSettings, theme, setTheme, members, notify } = useNova()
  const { navigate } = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [section, setSection] = useState<(typeof SETTINGS_SECTIONS)[number]>('Profile')
  const [draftUser, setDraftUser] = useState(user)
  const [draftSettings, setDraftSettings] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')
  const sections = SETTINGS_SECTIONS.filter((item) => item.toLowerCase().includes(query.toLowerCase()))

  const dirty =
    draftUser.name !== user.name ||
    draftUser.email !== user.email ||
    draftUser.avatar !== user.avatar ||
    JSON.stringify(draftSettings) !== JSON.stringify(settings)

  const patchSettings = (patch: Partial<AppSettings>) => setDraftSettings((current) => ({ ...current, ...patch }))

  const save = () => {
    setSaving(true)
    window.setTimeout(() => {
      setUser(draftUser)
      setSettings(draftSettings)
      setSaving(false)
      notify('success', 'Settings saved successfully.')
    }, 700)
  }

  return (
    <AppLayout header={<Header searchPlaceholder="Search settings..." searchValue={query} onSearch={setQuery} />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Settings</h1>
            <p>Workspace, profile, AI preferences, and security.</p>
          </div>
        </section>
        <div className="settings-layout">
          <nav className="settings-nav">
            {sections.map((item) => (
              <button key={item} type="button" className={section === item ? 'is-selected' : ''} onClick={() => setSection(item)}>
                {item}
              </button>
            ))}
          </nav>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {section === 'General' ? (
              <Card header={<h2>General</h2>}>
                <div className="card__body">
                  <Input label="Workspace Name" value={draftSettings.workspaceName} onChange={(event) => patchSettings({ workspaceName: event.target.value })} />
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Enforce usage limits</strong>
                      <p className="muted">Cap compute when the monthly budget is reached.</p>
                    </div>
                    <Switch checked={draftSettings.enforceLimits} onChange={(value) => patchSettings({ enforceLimits: value })} label="Enforce usage limits" />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Profile' ? (
              <Card header={<h2>Profile</h2>}>
                <div className="card__body">
                  <div className="avatar-row">
                    <Avatar src={draftUser.avatar} name={draftUser.name} size="lg" />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => setDraftUser((current) => ({ ...current, avatar: String(reader.result) }))
                        reader.readAsDataURL(file)
                      }}
                    />
                    <Button variant="secondary" type="button" onClick={() => fileRef.current?.click()}>
                      Change Avatar
                    </Button>
                    <Button variant="danger" type="button" onClick={() => setDraftUser((current) => ({ ...current, avatar: '' }))}>
                      Remove
                    </Button>
                  </div>
                  <div className="form-grid" style={{ marginTop: 16 }}>
                    <Input label="Full Name" value={draftUser.name} onChange={(event) => setDraftUser((current) => ({ ...current, name: event.target.value }))} />
                    <Input label="Email Address" value={draftUser.email} onChange={(event) => setDraftUser((current) => ({ ...current, email: event.target.value }))} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Input label="Role" value={draftUser.role} disabled />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'AI Preferences' ? (
              <Card header={<h2>AI Preferences</h2>}>
                <div className="card__body">
                  <label className="field">
                    Default model
                    <select className="input" value={draftSettings.defaultModel} onChange={(event) => patchSettings({ defaultModel: event.target.value })}>
                      <option>Nova-Base</option>
                      <option>Nova-Pro-Vision</option>
                      <option>Nova-Ultra</option>
                    </select>
                  </label>
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Auto-handoff</strong>
                      <p className="muted">Product → UX → Design → Code without extra confirmation.</p>
                    </div>
                    <Switch checked={draftSettings.autoHandoff} onChange={(value) => patchSettings({ autoHandoff: value })} label="Auto-handoff" />
                  </div>
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Memory retention</strong>
                      <p className="muted">Keep project memory across sessions.</p>
                    </div>
                    <Switch checked={draftSettings.memoryRetention} onChange={(value) => patchSettings({ memoryRetention: value })} label="Memory retention" />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Notifications' ? (
              <Card header={<h2>Notifications</h2>}>
                <div className="card__body">
                  <div className="toggle-row">
                    <div>
                      <strong>Email alerts</strong>
                      <p className="muted">Failed jobs, usage spikes, billing events.</p>
                    </div>
                    <Switch checked={draftSettings.emailAlerts} onChange={(value) => patchSettings({ emailAlerts: value })} label="Email alerts" />
                  </div>
                  <div className="toggle-row" style={{ marginTop: 12 }}>
                    <div>
                      <strong>Product tips</strong>
                      <p className="muted">Occasional workflow recommendations.</p>
                    </div>
                    <Switch checked={draftSettings.productTips} onChange={(value) => patchSettings({ productTips: value })} label="Product tips" />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Appearance' ? (
              <Card header={<h2>Appearance</h2>}>
                <div className="card__body">
                  <div className="toggle-row">
                    <div>
                      <strong>Dark theme</strong>
                      <p className="muted">Product Workspace default. Light mode is available for daytime review.</p>
                    </div>
                    <Switch checked={theme === 'dark'} onChange={(value) => setTheme(value ? 'dark' : 'light')} label="Dark theme" />
                  </div>
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Language</strong>
                      <p className="muted">Chrome labels. Product copy can stay bilingual.</p>
                    </div>
                    <LanguageSwitcher />
                  </div>
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Compact density</strong>
                      <p className="muted">Reduce padding in tables and navigation.</p>
                    </div>
                    <Switch checked={draftSettings.compact} onChange={(value) => patchSettings({ compact: value })} label="Compact density" />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Integrations' ? (
              <Card header={<h2>Integrations</h2>}>
                <div className="card__body">
                  {(['slack', 'github', 'figma'] as const).map((key) => (
                    <div key={key} className="toggle-row" style={{ marginBottom: 12 }}>
                      <strong style={{ textTransform: 'capitalize' }}>{key}</strong>
                      <Switch checked={draftSettings[key]} onChange={(value) => patchSettings({ [key]: value })} label={key} />
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {section === 'Security' ? (
              <Card header={<h2>Security</h2>}>
                <div className="card__body">
                  <div className="toggle-row">
                    <div>
                      <strong>Two-factor authentication</strong>
                      <p className="muted">Require a one-time code at sign-in.</p>
                    </div>
                    <Switch checked={draftSettings.twoFactor} onChange={(value) => patchSettings({ twoFactor: value })} label="Two-factor authentication" />
                  </div>
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Workspace API key</strong>
                      <p className="muted">nova_sk_live_••••••••4f2a</p>
                    </div>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        void navigator.clipboard?.writeText('nova_sk_live_demo_4f2a')
                        notify('success', 'API key copied.')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Members' ? (
              <Card header={<h2>Members</h2>}>
                <div className="card__body">
                  <p>{members.length} people in this workspace.</p>
                  <div style={{ marginTop: 16 }}>
                    <Button type="button" onClick={() => navigate('/team')}>
                      Manage team
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button
                variant="ghost"
                type="button"
                disabled={!dirty}
                onClick={() => {
                  setDraftUser(user)
                  setDraftSettings(settings)
                }}
              >
                Cancel
              </Button>
              <Button type="button" loading={saving} disabled={!dirty} onClick={save}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
