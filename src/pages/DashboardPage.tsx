import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, Card, ChartContainer, Icon, Table } from '../components/ui'
import { DASHBOARD_METRICS, TRANSACTIONS } from '../data/mock'

const BARS = [
  { month: 'Jan', height: '30%' },
  { month: 'Feb', height: '45%' },
  { month: 'Mar', height: '40%' },
  { month: 'Apr', height: '60%' },
  { month: 'May', height: '75%' },
  { month: 'Jun', height: '90%' },
]

export function DashboardPage() {
  const [tab, setTab] = useState('Overview')
  const [query, setQuery] = useState('')
  const [range, setRange] = useState('Oct 24 - Nov 24, 2023')
  const [dateOpen, setDateOpen] = useState(false)
  const [metric, setMetric] = useState('Total Revenue')

  const rows = useMemo(
    () => TRANSACTIONS.filter((row) => `${row.customer} ${row.status} ${row.amount}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <AppLayout
      header={
        <Header
          searchPlaceholder="Search..."
          searchValue={query}
          onSearch={setQuery}
          tabs={['Overview', 'Reports', 'Activity']}
          tab={tab}
          onTab={setTab}
        />
      }
    >
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Welcome back, Team</h1>
            <p>Here is what's happening with your projects today.</p>
          </div>
          <button className="date-picker" type="button" onClick={() => setDateOpen((open) => !open)}>
            <Icon name="calendar_today" />
            <span>{range}</span>
            <Icon name="expand_more" />
          </button>
        </section>
        {dateOpen ? (
          <div className="popover date-popover" role="dialog">
            <div className="popover__header">
              <strong>Date range</strong>
              <button className="icon-button" type="button" onClick={() => setDateOpen(false)} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
            <div className="date-presets">
              {['Last 7 days', 'Last 30 days', 'This month'].map((preset) => (
                <button key={preset} type="button" className={range.includes(preset) || (preset === 'This month' && range.startsWith('Oct')) ? 'is-selected' : ''} onClick={() => setRange(preset)}>
                  {preset}
                </button>
              ))}
            </div>
            <Button
              type="button"
              onClick={() => {
                setDateOpen(false)
              }}
            >
              Apply
            </Button>
          </div>
        ) : null}

        {tab === 'Overview' ? (
          <>
            <section className="metrics">
              {DASHBOARD_METRICS.map((item) => (
                <button key={item.label} className={`metric-card${metric === item.label ? ' metric-card--active' : ''}`} type="button" onClick={() => setMetric(item.label)}>
                  <div className="metric-card__title">
                    {item.label}
                    <Icon name={item.icon} />
                  </div>
                  <div className="metric-card__value">
                    {item.value}
                    <span className={`trend ${item.up ? 'trend--up' : 'trend--down'}`}>
                      <Icon name={item.up ? 'trending_up' : 'trending_down'} />
                      {item.delta}
                    </span>
                  </div>
                </button>
              ))}
            </section>
            <section className="charts">
              <ChartContainer title={`${metric} Growth`} action={<button className="icon-button" type="button" aria-label="More"><Icon name="more_horiz" /></button>}>
                <div className="bar-chart" aria-label="Revenue growth">
                  {BARS.map((bar) => (
                    <div key={bar.month} className="bar" style={{ '--height': bar.height } as CSSProperties} data-month={bar.month} />
                  ))}
                </div>
              </ChartContainer>
              <Card header={<h2>Traffic Sources</h2>}>
                <div className="traffic">
                  <div className="donut">Total</div>
                  <div className="legend">
                    <span><i className="legend__dot" />Direct</span>
                    <span><i className="legend__dot legend__dot--organic" />Organic</span>
                    <span><i className="legend__dot legend__dot--referral" />Referral</span>
                  </div>
                </div>
              </Card>
            </section>
            <Card header={<><h2>Recent Transactions</h2><button className="text-button" type="button">View All</button></>}>
              {rows.length === 0 ? (
                <div className="empty-state">No matching transactions.</div>
              ) : (
                <Table columns={['Customer', 'Status', 'Amount', 'Date']}>
                  {rows.map((row) => (
                    <tr key={row.customer}>
                      <td>
                        <span className="customer">
                          <span className="avatar avatar--company">{row.initial}</span>
                          {row.customer}
                        </span>
                      </td>
                      <td>
                        <Badge tone={row.status === 'Success' ? 'success' : row.status === 'Failed' ? 'danger' : 'pending'}>{row.status}</Badge>
                      </td>
                      <td className="amount">{row.amount}</td>
                      <td className="muted">{row.date}</td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </>
        ) : (
          <Card>
            <div className="empty-state">
              <Icon name="insights" />
              <p>{tab} for {range} will appear here. Switch back to Overview for live metrics.</p>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
