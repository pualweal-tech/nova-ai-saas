import { useEffect, useRef, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, EmptyState, Icon } from '../components/ui'
import { useNova } from '../app/NovaProvider'
import { useRouter } from '../app/router'
import type { ArtifactTab } from '../types'

const TABS: ArtifactTab[] = ['PRD', 'User Flow', 'Design System', 'Code']

export function WorkspacePage({ projectId }: { projectId: string }) {
  const { projects, sendCommand, notify } = useNova()
  const { navigate } = useRouter()
  const project = projects.find((item) => item.id === projectId)
  const [draft, setDraft] = useState('')
  const [tab, setTab] = useState<ArtifactTab>('Design System')
  const [panel, setPanel] = useState<'none' | 'agents' | 'artifacts'>('none')
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [project?.events.length])

  if (!project) {
    return (
      <AppLayout>
        <EmptyState icon="error" title="Project not found" action={<Button type="button" onClick={() => navigate('/projects')}>Back to projects</Button>} />
      </AppLayout>
    )
  }

  const submit = (text = draft) => {
    if (!text.trim()) return
    sendCommand(project.id, text)
    setDraft('')
  }

  const artifact =
    tab === 'PRD' ? project.artifacts.prd : tab === 'User Flow' ? project.artifacts.userFlow : tab === 'Code' ? project.artifacts.code : project.artifacts.designSystem

  return (
    <AppLayout
      workspace
      header={
        <Header
          leading={
            <>
              <button className="workspace-mobile-button" type="button" onClick={() => setPanel(panel === 'agents' ? 'none' : 'agents')} aria-label="Agents">
                <Icon name="view_sidebar" />
              </button>
              <div className="breadcrumb">
                <button type="button" onClick={() => navigate('/projects')}>
                  Projects
                </button>
                <Icon name="chevron_right" />
                <strong>{project.name}</strong>
              </div>
            </>
          }
          extraActions={
            <>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  const blob = new Blob([project.artifacts.code || project.artifacts.prd], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-export.txt`
                  link.click()
                  URL.revokeObjectURL(url)
                  notify('success', 'Download started.')
                }}
              >
                <Icon name="download" />
                Download
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(window.location.href)
                  notify('success', 'Share link copied.')
                }}
              >
                <Icon name="ios_share" />
                Share
              </Button>
            </>
          }
        />
      }
    >
      <div className="workspace-page">
        <div className="workspace-shell">
          <aside className={`agent-col${panel === 'agents' ? ' is-open' : ''}`}>
            <div className="col-head">执行集群节点</div>
            <div className="agent-col__list">
              {project.nodes.map((node) => (
                <button key={node.id} className={`node-card${node.status === 'PROCESSING' || node.status === 'IDLE' ? ' node-card--active' : ''}`} type="button">
                  <div className="node-card__row">
                    <span>
                      <Icon name={node.icon} /> {node.name}
                    </span>
                    <Badge tone={node.status === 'PROCESSING' ? 'warning' : node.status === 'IDLE' ? 'success' : 'neutral'}>{node.status}</Badge>
                  </div>
                  <small>{node.summary}</small>
                </button>
              ))}
            </div>
            <div className="cluster-foot">
              <span>Cluster Status:</span>
              <strong style={{ color: 'var(--color-primary)' }}>{project.clusterStatus}</strong>
            </div>
          </aside>

          <section className="exec-col">
            <div className="col-head" style={{ textTransform: 'none', letterSpacing: 0 }}>
              <span>
                <Icon name="terminal" /> 执行终端与通讯协议
              </span>
              <button className="workspace-mobile-button" type="button" onClick={() => setPanel(panel === 'artifacts' ? 'none' : 'artifacts')} aria-label="Artifacts">
                <Icon name="insights" />
              </button>
            </div>
            <div className="transcript" ref={scroller}>
              {project.events.map((event) => (
                <article key={event.id} className={`term-row${event.actor === 'user' ? ' term-row--user' : ''}`}>
                  <div className="term-avatar">
                    <Icon name={event.actor === 'user' ? 'person' : event.actor === 'system' ? 'settings_system_daydream' : 'smart_toy'} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: event.actor === 'user' ? 'flex-end' : 'stretch' }}>
                    <div className="term-meta">
                      <span>{event.actor === 'user' ? 'SYS_ADMIN' : event.actor === 'system' ? 'SYSTEM_CORE' : event.actor}</span>
                    </div>
                    <div className="term-bubble">{event.text}</div>
                  </div>
                </article>
              ))}
            </div>
            <div className="exec-input">
              <form
                className="command-field"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit()
                }}
              >
                <Icon name="keyboard_double_arrow_right" className="lead" />
                <input value={draft} placeholder="输入系统指令或调整参数 (e.g., /generate code)" onChange={(event) => setDraft(event.target.value)} />
                <button className="send" type="submit" aria-label="Send" disabled={!draft.trim()}>
                  <Icon name="send" />
                </button>
              </form>
              <div className="slash-row">
                {['/analyze', '/refine_ui', '/export_json'].map((cmd) => (
                  <button key={cmd} type="button" onClick={() => submit(cmd)}>
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className={`artifact-col${panel === 'artifacts' ? ' is-open' : ''}`}>
            <div className="artifact-tabs">
              {TABS.map((item) => (
                <button key={item} className={`tab${tab === item ? ' tab--active' : ''}`} type="button" onClick={() => setTab(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="artifact-body">
              <div className="page-heading__actions" style={{ marginBottom: 16 }}>
                <h3>{tab === 'Design System' ? 'UI Tokens & Specs' : tab}</h3>
                {tab === 'Code' ? (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(project.artifacts.code)
                      notify('success', 'Code copied.')
                    }}
                  >
                    Copy
                  </Button>
                ) : null}
              </div>
              {tab === 'Design System' ? (
                <>
                  <article className="card card__body">
                    <h4 className="muted">Color Palette</h4>
                    {[
                      ['Background', '#131313', '#131313'],
                      ['Surface Elevated', '#121212', '#121212'],
                      ['Primary Container', '#0050CB', '#0050cb'],
                    ].map(([label, hex, color]) => (
                      <div key={label} className="token-row">
                        <span>
                          <i className="swatch" style={{ background: color }} />
                          {label}
                        </span>
                        <span className="muted">{hex}</span>
                      </div>
                    ))}
                  </article>
                  <article className="card card__body" style={{ marginTop: 16 }}>
                    <h4 className="muted">Layout Rules</h4>
                    <p className="muted">Left_Panel w-72 · Right_Panel 420px · Center flex-1</p>
                  </article>
                </>
              ) : (
                <pre className="code-block">{artifact}</pre>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
