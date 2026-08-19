import { useState } from 'react'
import { useRouter } from '../app/router'
import { AppLayout, Header } from '../components/layout'
import { Avatar, Button, Card, Input, Switch } from '../components/ui'
import { SETTINGS_SECTIONS } from '../data/mock'

function WorkspaceCard({
  workspace,
  setWorkspace,
  limits,
  setLimits,
  onManage,
}: {
  workspace: string
  setWorkspace: (value: string) => void
  limits: boolean
  setLimits: (value: boolean) => void
  onManage: () => void
}) {
  return (
    <Card
      header={
        <div>
          <h2 className="card__title">Workspace Settings</h2>
          <p className="muted">Manage your team environment and resource limits.</p>
        </div>
      }
    >
      <div className="card__body">
        <Input label="Workspace Name" value={workspace} onChange={(event) => setWorkspace(event.target.value)} />
        <div className="members-box" style={{ marginTop: 16 }}>
          <div>
            <strong>Members</strong>
            <p className="muted">12 active members in this workspace.</p>
          </div>
          <button className="text-button" type="button" onClick={onManage}>
            Manage List →
          </button>
        </div>
        <div className="toggle-row" style={{ marginTop: 16 }}>
          <div>
            <strong>Enforce Usage Limits</strong>
            <p className="muted">Automatically cap compute queries when budget is reached.</p>
          </div>
          <Switch checked={limits} onChange={setLimits} label="Enforce usage limits" />
        </div>
      </div>
    </Card>
  )
}

export function SettingsPage() {
  const { navigate } = useRouter()
  const [section, setSection] = useState<(typeof SETTINGS_SECTIONS)[number]>('Account')
  const [name, setName] = useState('Jane Doe')
  const [email, setEmail] = useState('jane.doe@nova-analytics.com')
  const [workspace, setWorkspace] = useState('Alpha Quadrant Analytics')
  const [limits, setLimits] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [compact, setCompact] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [productTips, setProductTips] = useState(false)
  const dirty = name !== 'Jane Doe' || email !== 'jane.doe@nova-analytics.com'

  const save = () => {
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 1600)
    }, 700)
  }

  return (
    <AppLayout header={<Header searchPlaceholder="Search analytics..." searchValue="" onSearch={() => undefined} />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Settings</h1>
            <p>Manage your account, workspace, AI preferences, and security settings.</p>
          </div>
        </section>
        <div className="settings-layout">
          <nav className="settings-nav">
            {SETTINGS_SECTIONS.map((item) => (
              <button key={item} type="button" className={section === item ? 'is-selected' : ''} onClick={() => setSection(item)}>
                {item}
              </button>
            ))}
          </nav>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {section === 'Account' ? (
              <>
                <Card
                  header={
                    <div>
                      <h2 className="card__title">Account Profile</h2>
                      <p className="muted">Update your personal details and public profile.</p>
                    </div>
                  }
                >
                  <div className="card__body">
                    <div className="avatar-row">
                      <Avatar src="https://i.pravatar.cc/64?img=5" name="Jane Doe" size="lg" />
                      <Button variant="secondary" type="button">
                        Change Avatar
                      </Button>
                      <Button variant="danger" type="button">
                        Remove
                      </Button>
                    </div>
                    <div className="form-grid" style={{ marginTop: 16 }}>
                      <Input label="Full Name" value={name} onChange={(event) => setName(event.target.value)} />
                      <Input label="Email Address" value={email} onChange={(event) => setEmail(event.target.value)} />
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Input label="Role" value="Senior Data Scientist" disabled />
                    </div>
                    <div className="divider" />
                    <div className="password-row">
                      <div>
                        <strong>Password</strong>
                        <p className="muted">Last changed 3 months ago</p>
                      </div>
                      <Button variant="secondary" type="button">
                        Update Password
                      </Button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 16, background: 'var(--color-surface-low)', borderTop: 'var(--border)' }}>
                    <Button variant="ghost" type="button" disabled={!dirty}>
                      Cancel
                    </Button>
                    <Button type="button" loading={saving} disabled={!dirty} onClick={save}>
                      Save Changes
                    </Button>
                  </div>
                  {saved ? <div className="success-banner">Profile saved.</div> : null}
                </Card>
                <WorkspaceCard
                  workspace={workspace}
                  setWorkspace={setWorkspace}
                  limits={limits}
                  setLimits={setLimits}
                  onManage={() => navigate('/team')}
                />
              </>
            ) : null}

            {section === 'Workspace' ? (
              <WorkspaceCard
                workspace={workspace}
                setWorkspace={setWorkspace}
                limits={limits}
                setLimits={setLimits}
                onManage={() => navigate('/team')}
              />
            ) : null}

            {section === 'AI Preferences' ? (
              <Card header={<h2>AI Preferences</h2>}>
                <div className="card__body">
                  <label className="field">
                    Default model
                    <select className="input" defaultValue="Nova-Pro-Vision">
                      <option>Nova-Base</option>
                      <option>Nova-Pro-Vision</option>
                      <option>Nova-Ultra</option>
                    </select>
                  </label>
                  <div className="toggle-row" style={{ marginTop: 16 }}>
                    <div>
                      <strong>Ground answers in uploaded files</strong>
                      <p className="muted">Prefer dataset evidence over general knowledge.</p>
                    </div>
                    <Switch checked={limits} onChange={setLimits} label="Ground answers" />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Appearance' ? (
              <Card header={<h2>Appearance</h2>}>
                <div className="card__body toggle-row">
                  <div>
                    <strong>Compact density</strong>
                    <p className="muted">Reduce padding in tables and navigation.</p>
                  </div>
                  <Switch checked={compact} onChange={setCompact} label="Compact density" />
                </div>
              </Card>
            ) : null}

            {section === 'Notifications' ? (
              <Card header={<h2>Notifications</h2>}>
                <div className="card__body">
                  <div className="toggle-row">
                    <div>
                      <strong>Email alerts</strong>
                      <p className="muted">Usage spikes, failed jobs, and billing events.</p>
                    </div>
                    <Switch checked={emailAlerts} onChange={setEmailAlerts} label="Email alerts" />
                  </div>
                  <div className="toggle-row" style={{ marginTop: 12 }}>
                    <div>
                      <strong>Product tips</strong>
                      <p className="muted">Occasional workflow recommendations.</p>
                    </div>
                    <Switch checked={productTips} onChange={setProductTips} label="Product tips" />
                  </div>
                </div>
              </Card>
            ) : null}

            {section === 'Security' ? (
              <Card header={<h2>Security</h2>}>
                <div className="card__body toggle-row">
                  <div>
                    <strong>Two-factor authentication</strong>
                    <p className="muted">Require a one-time code at sign-in.</p>
                  </div>
                  <Switch checked onChange={() => undefined} label="Two-factor authentication" />
                </div>
              </Card>
            ) : null}

            {section === 'Billing' ? (
              <Card header={<h2>Billing</h2>}>
                <div className="card__body">
                  <p>You are on NOVA Pro. Manage invoices and plans in Billing.</p>
                  <div style={{ marginTop: 16 }}>
                    <Button type="button" onClick={() => navigate('/billing')}>
                      Open Billing
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
