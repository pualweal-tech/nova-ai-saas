import { AppLayout, Header } from '../components/layout'
import { Button, DateRangePicker, EmptyState, Icon } from '../components/ui'
import { useNova } from '../app/NovaProvider'
import { useRouter } from '../app/router'
import { inRange, relativeTime } from '../utils/dates'
import { useMemo, useState } from 'react'

export function DashboardPage() {
  const { projects, createProject, sendCommand, dateRange, setDateRange, notify } = useNova()
  const { navigate } = useRouter()
  const [query, setQuery] = useState('')
  const [idea, setIdea] = useState('')
  const [busy, setBusy] = useState(false)

  const recent = useMemo(
    () =>
      projects
        .filter((project) => inRange(project.updatedAt, dateRange))
        .filter((project) => project.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3),
    [projects, dateRange, query],
  )

  const launch = () => {
    const text = idea.trim()
    if (!text) {
      notify('error', 'Describe what you want to create.')
      return
    }
    setBusy(true)
    window.setTimeout(() => {
      const name = text.slice(0, 42)
      const project = createProject({ name, description: text, idea: text, status: 'DRAFT', icon: 'auto_awesome' })
      sendCommand(project.id, text)
      setBusy(false)
      setIdea('')
      navigate(`/projects/${project.id}`)
    }, 500)
  }

  return (
    <AppLayout header={<Header searchPlaceholder="Search..." searchValue={query} onSearch={setQuery} />}>
      <div className="page-shell dashboard-shell">
        <div className="hero-create">
          <div className="hero-mark">
            <Icon name="auto_awesome" />
          </div>
          <h1>你想创造什么？</h1>
          <p className="muted">描述您的想法，NOVA AI 将为您构建完整的产品架构、界面和逻辑。</p>
          <div className="composer-card">
            <textarea
              placeholder="例如：“我想创建一个AI健身教练App，包含视频分析、营养计划和社交分享功能...”"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) launch()
              }}
            />
            <div className="composer-toolbar">
              <div>
                <button className="icon-button" type="button" aria-label="Attach" onClick={() => notify('info', 'File attached to project context.')}>
                  <Icon name="attach_file" />
                </button>
                <button className="icon-button" type="button" aria-label="Voice" onClick={() => notify('info', 'Voice input is mocked in this prototype.')}>
                  <Icon name="mic" />
                </button>
                <button className="icon-button" type="button" aria-label="Composer settings" onClick={() => navigate('/settings')}>
                  <Icon name="tune" />
                </button>
              </div>
              <Button type="button" loading={busy} onClick={launch}>
                启动 NOVA
                <Icon name="rocket_launch" />
              </Button>
            </div>
          </div>
        </div>

        <section className="recent-block">
          <div className="section-label">
            <span>最近项目</span>
            <div className="section-label__actions">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <button className="text-button" type="button" onClick={() => navigate('/projects')}>
                查看全部
              </button>
            </div>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon="folder_open" title="No projects in this range" body="Create one above, or widen the date filter." />
          ) : (
            <div className="project-bento">
              {recent.map((project) => (
                <button key={project.id} className="project-tile" type="button" onClick={() => navigate(`/projects/${project.id}`)}>
                  <span className="project-tile__bar" />
                  <div className="project-tile__top">
                    <Icon name={project.icon} />
                    <span className={`badge ${project.status === 'ACTIVE' ? 'badge--success' : 'badge--neutral'}`}>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>
                    {project.version} • {relativeTime(project.updatedAt)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}
