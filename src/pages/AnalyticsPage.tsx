import { useMemo, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Badge, Card, ChartContainer, Icon, Progress, Table } from '../components/ui'
import { AI_ACTIVITIES, ANALYTICS_METRICS, CHART_SERIES } from '../data/mock'

function AreaChart({ values }: { values: number[] }) {
  const max = Math.max(...values)
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100
    const y = 100 - (value / max) * 86 - 6
    return `${x},${y}`
  })
  const line = `M ${points[0].replace(',', ' ')} ` + points.slice(1).map((point) => `L ${point.replace(',', ' ')}`).join(' ')
  const area = `${line} L 100 100 L 0 100 Z`

  return (
    <div className="area-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="AI usage trend">
        <defs>
          <linearGradient id="nova-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0050CB" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0050CB" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#nova-fill)" />
        <path d={line} fill="none" stroke="#0050CB" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

export function AnalyticsPage() {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState(ANALYTICS_METRICS[0].label)
  const values = CHART_SERIES[range]
  const activities = useMemo(
    () => AI_ACTIVITIES.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.model.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <AppLayout header={<Header searchPlaceholder="Search analytics..." searchValue={query} onSearch={setQuery} />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Analytics</h1>
            <p>Monitor AI performance and usage insights.</p>
          </div>
        </section>
        <section className="metrics">
          {ANALYTICS_METRICS.map((item) => (
            <button key={item.label} className={`metric-card${focus === item.label ? ' metric-card--active' : ''}`} type="button" onClick={() => setFocus(item.label)}>
              <div className="metric-card__title">
                {item.label}
                <Icon name={item.icon} />
              </div>
              <div className="metric-card__value">
                {item.value}
                <span className={`trend ${item.up ? 'trend--up' : 'trend--down'}`}>
                  {item.delta}
                </span>
              </div>
              <span className="metric-card__hint">{item.hint}</span>
            </button>
          ))}
        </section>
        <section className="charts">
          <ChartContainer
            title={`${focus} trend`}
            action={
              <div className="segmented">
                {(['daily', 'weekly', 'monthly'] as const).map((item) => (
                  <button key={item} type="button" className={range === item ? 'is-selected' : ''} onClick={() => setRange(item)}>
                    {item[0].toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            }
          >
            <AreaChart values={values} />
          </ChartContainer>
          <Card header={<h2>Model Performance</h2>}>
            <div className="card__body">
              <div className="perf-row">
                <header>
                  <span>Accuracy Rate</span>
                  <strong>98.2%</strong>
                </header>
                <Progress value={98} />
              </div>
              <div className="perf-row">
                <header>
                  <span>Response Quality</span>
                  <strong>4.8/5.0</strong>
                </header>
                <Progress value={96} tone="success" />
              </div>
              <div className="perf-row">
                <header>
                  <span>Task Completion Rate</span>
                  <strong>96.5%</strong>
                </header>
                <Progress value={96} tone="violet" />
              </div>
              <div className="health-box">Overall System Health: Excellent</div>
            </div>
          </Card>
        </section>
        <Card header={<><h2>Recent AI Activities</h2><button className="text-button" type="button">View All</button></>}>
          {activities.length === 0 ? (
            <div className="empty-state">No activities match “{query}”.</div>
          ) : (
            <Table columns={['Activity', 'Model', 'Status', 'Time']}>
              {activities.map((item) => (
                <tr key={item.title}>
                  <td>
                    <span className="customer">
                      <span className={`activity-icon${item.tone === 'violet' ? ' activity-icon--violet' : item.tone === 'warn' ? ' activity-icon--warn' : ''}`}>
                        <Icon name={item.icon} />
                      </span>
                      {item.title}
                    </span>
                  </td>
                  <td className="muted">{item.model}</td>
                  <td>
                    <Badge tone={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</Badge>
                  </td>
                  <td className="muted">{item.time}</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
