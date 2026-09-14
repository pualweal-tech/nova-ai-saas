import { useMemo, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Button, Card, DateRangePicker, EmptyState, Icon, Progress } from '../components/ui'
import { useNova } from '../app/NovaProvider'
import { dayCount, inRange } from '../utils/dates'

function AreaChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  const [hover, setHover] = useState<number | null>(null)
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100
    const y = 100 - (value / max) * 86 - 6
    return { x, y, value }
  })
  const line = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((point) => `L ${point.x} ${point.y}`).join(' ')
  const area = `${line} L 100 100 L 0 100 Z`

  return (
    <div className="area-chart" onMouseLeave={() => setHover(null)}>
      {hover !== null ? <div className="chart-tooltip">Point {hover + 1}: {values[hover]}</div> : null}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Creation trend">
        <defs>
          <linearGradient id="nova-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0050CB" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0050CB" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#nova-fill)" />
        <path d={line} fill="none" stroke="#0050CB" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2.2"
            fill="#0050CB"
            onMouseEnter={() => setHover(index)}
          />
        ))}
      </svg>
    </div>
  )
}

export function AnalyticsPage() {
  const { projects, dateRange, setDateRange, notify } = useNova()
  const [query, setQuery] = useState('')
  const [refresh, setRefresh] = useState(0)
  const days = dayCount(dateRange)
  const created = projects.filter((project) => inRange(project.createdAt, dateRange)).length
  const agentRuns = created * 18 + days * 6 + refresh
  const hours = Math.round(created * 7.2 + days * 0.8)
  const assets = created * 24 + days * 3
  const series = Array.from({ length: Math.min(days, 12) }, (_, index) => Math.round(8 + ((index + created + refresh) % 7) * 6 + days / 4))

  const activities = useMemo(
    () =>
      projects
        .filter((project) => inRange(project.updatedAt, dateRange))
        .filter((project) => project.name.toLowerCase().includes(query.toLowerCase()))
        .map((project) => ({
          title: `${project.name} pipeline`,
          status: project.status,
          time: project.updatedAt,
        })),
    [projects, dateRange, query],
  )

  const exportCsv = () => {
    const blob = new Blob(
      [`metric,value\nprojects,${created}\nagents,${agentRuns}\nhours,${hours}\nassets,${assets}\n`],
      { type: 'text/csv' },
    )
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'nova-analytics.csv'
    link.click()
    URL.revokeObjectURL(url)
    notify('success', 'Export ready.')
  }

  return (
    <AppLayout header={<Header searchPlaceholder="Search analytics..." searchValue={query} onSearch={setQuery} />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>AI 产品智能分析</h1>
            <p>NOVA AI 2.0 智能分析中心 - 实时监控与洞察</p>
          </div>
          <div className="page-heading__actions">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setRefresh((value) => value + 1)
                notify('info', 'Analytics refreshed.')
              }}
            >
              <Icon name="refresh" />
              Refresh
            </Button>
            <Button variant="secondary" type="button" onClick={exportCsv}>
              <Icon name="download" />
              Export
            </Button>
          </div>
        </section>
        <section className="metrics">
          {[
            { label: '项目创建数量', value: String(created), delta: '↑ 15%', icon: 'folder_special' },
            { label: 'Agent 执行任务', value: String(agentRuns), delta: '↑ 32%', icon: 'smart_toy' },
            { label: '节省时间', value: `${hours}h`, delta: '本月累计', icon: 'timer' },
            { label: '生成资产', value: String(assets), delta: '↑ 8%', icon: 'inventory_2' },
          ].map((item) => (
            <article key={item.label} className="metric-card">
              <div className="metric-card__title">
                {item.label}
                <Icon name={item.icon} />
              </div>
              <div className="metric-card__value">
                {item.value}
                <span className="trend trend--up">{item.delta}</span>
              </div>
            </article>
          ))}
        </section>
        <section className="charts">
          <Card header={<h2>Creation trend</h2>}>
            <AreaChart values={series} />
          </Card>
          <Card header={<h2>Model Performance</h2>}>
            <div className="card__body">
              <div className="toggle-row">
                <span>Accuracy Rate</span>
                <strong>98.2%</strong>
              </div>
              <Progress value={98} />
              <div className="toggle-row" style={{ marginTop: 16 }}>
                <span>Task Completion</span>
                <strong>96.5%</strong>
              </div>
              <Progress value={96} tone="success" />
            </div>
          </Card>
        </section>
        <Card header={<h2>Recent AI Activities</h2>}>
          {activities.length === 0 ? (
            <EmptyState icon="insights" title="No activity in this range" />
          ) : (
            <div className="card__body">
              {activities.map((item) => (
                <div key={item.title} className="toggle-row" style={{ padding: '8px 0', borderBottom: 'var(--border)' }}>
                  <span>{item.title}</span>
                  <span className="muted">{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
