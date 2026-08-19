import { useState } from 'react'
import { useNova } from '../app/NovaProvider'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, Card, Icon, Modal, Progress, Table } from '../components/ui'
import { INVOICES, PLANS } from '../data/mock'

export function BillingPage() {
  const { selectedPlan, setSelectedPlan, notify } = useNova()
  const [confirm, setConfirm] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const choose = (id: string) => {
    if (id === selectedPlan) return
    setConfirm(id)
  }

  return (
    <AppLayout header={<Header />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Billing</h1>
            <p>Manage your subscription, usage, and payment details.</p>
          </div>
        </section>
        <div className="billing-top">
          <Card
            header={
              <>
                <div>
                  <h2>
                    NOVA Pro <Badge tone="success">ACTIVE</Badge>
                  </h2>
                  <p className="muted">Renews on Oct 24, 2024</p>
                </div>
                <div className="page-heading__actions">
                  <Button variant="secondary" type="button">
                    Manage Subscription
                  </Button>
                  <Button type="button" onClick={() => choose('enterprise')}>
                    Upgrade Plan
                  </Button>
                </div>
              </>
            }
          >
            <div className="card__body usage-grid">
              <div className="plan-inner">
                <p className="muted">Team Members</p>
                <strong style={{ fontSize: 20 }}>12 / 15 seats</strong>
              </div>
              <div className="plan-inner">
                <header>
                  <span className="muted">AI Credits Remaining (Monthly)</span>
                  <strong>75%</strong>
                </header>
                <Progress value={75} />
                <p className="muted" style={{ marginTop: 8 }}>
                  750k / 1M credits used
                </p>
              </div>
            </div>
          </Card>
          <Card
            header={
              <>
                <h2>Payment Method</h2>
                <button className="text-button" type="button">
                  Edit
                </button>
              </>
            }
          >
            <div className="card__body">
              <div className="pay-card">
                <Icon name="credit_card" />
                <span className="muted">VISA · Primary Card</span>
                <strong>•••• •••• •••• 4242</strong>
              </div>
            </div>
          </Card>
        </div>
        <div className="billing-top">
          <Card header={<h2>Usage Statistics</h2>}>
            <div className="card__body usage-grid">
              <article className="usage-card">
                <header>
                  <span>AI Requests</span>
                  <strong>85%</strong>
                </header>
                <Progress value={85} />
                <p className="muted">850k / 1M requests</p>
              </article>
              <article className="usage-card">
                <header>
                  <span>Token Consumption</span>
                  <strong>62%</strong>
                </header>
                <Progress value={62} tone="violet" />
                <p className="muted">3.1M / 5M tokens</p>
              </article>
              <article className="usage-card">
                <header>
                  <span>Storage Usage</span>
                  <strong>40%</strong>
                </header>
                <Progress value={40} tone="success" />
                <p className="muted">40GB / 100GB</p>
              </article>
              <article className="usage-card">
                <header>
                  <span>API Usage</span>
                  <strong>92%</strong>
                </header>
                <Progress value={92} tone="danger" />
                <p className="muted">92k / 100k calls</p>
              </article>
            </div>
          </Card>
          <Card header={<h2>Invoice History</h2>}>
            <Table columns={['Date', 'Amount', 'Status']}>
              {INVOICES.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td className="amount">{row.amount}</td>
                  <td>
                    <Badge tone="success">{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
        <section>
          <h2>Pricing Plans</h2>
          <p className="muted">Select a plan that fits your team’s needs.</p>
        </section>
        <div className="pricing">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`plan-card${plan.featured ? ' plan-card--featured' : ''}${selectedPlan === plan.id ? ' card--selected' : ''}`}
            >
              {plan.featured ? <Badge tone="info">RECOMMENDED</Badge> : null}
              <h3>{plan.name}</h3>
              <p>
                <strong style={{ fontSize: 32 }}>{plan.price}</strong>
                <span className="muted">{plan.cadence}</span>
              </p>
              <p className="muted">{plan.copy}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Icon name="check" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={selectedPlan === plan.id ? 'secondary' : 'primary'}
                type="button"
                disabled={selectedPlan === plan.id && plan.id === 'pro'}
                onClick={() => choose(plan.id)}
              >
                {selectedPlan === plan.id ? 'Current Plan' : plan.cta}
              </Button>
            </article>
          ))}
        </div>
      </div>
      <Modal
        open={Boolean(confirm)}
        title="Change plan"
        onClose={() => setConfirm(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              loading={busy}
              onClick={() => {
                if (!confirm) return
                setBusy(true)
                window.setTimeout(() => {
                  setSelectedPlan(confirm)
                  setBusy(false)
                  setConfirm(null)
                  notify({ tone: 'success', text: 'Plan updated.' })
                }, 700)
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p>Switch to the {confirm} plan? This is a prototype confirmation only.</p>
      </Modal>
    </AppLayout>
  )
}
