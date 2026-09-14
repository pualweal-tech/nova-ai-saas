import { useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, Card, Modal, Progress, Table } from '../components/ui'
import { INVOICES, PLANS } from '../data/seed'
import { useNova } from '../app/NovaProvider'

export function BillingPage() {
  const { selectedPlan, setSelectedPlan, notify } = useNova()
  const [confirm, setConfirm] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <AppLayout header={<Header />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Billing</h1>
            <p>Manage your subscription, usage, and payment details.</p>
          </div>
        </section>
        <Card
          header={
            <>
              <div>
                <h2>
                  NOVA Pro <Badge tone="success">ACTIVE</Badge>
                </h2>
                <p className="muted">Renews on Sep 24, 2026</p>
              </div>
            </>
          }
        >
          <div className="card__body">
            <p className="muted">AI Credits Remaining (Monthly)</p>
            <Progress value={75} />
            <p className="muted" style={{ marginTop: 8 }}>
              750k / 1M credits used
            </p>
          </div>
        </Card>
        <div className="pricing">
          {PLANS.map((plan) => (
            <article key={plan.id} className={`card plan-card${plan.featured ? ' plan-card--featured' : ''}`}>
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.price}
                <small className="muted">{plan.cadence}</small>
              </div>
              <p className="muted">{plan.copy}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Button
                variant={selectedPlan === plan.id ? 'secondary' : 'primary'}
                type="button"
                disabled={selectedPlan === plan.id}
                onClick={() => setConfirm(plan.id)}
              >
                {selectedPlan === plan.id ? 'Current Plan' : plan.cta}
              </Button>
            </article>
          ))}
        </div>
        <Card header={<h2>Invoices</h2>}>
          <Table columns={['Date', 'Amount', 'Status']}>
            {INVOICES.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.amount}</td>
                <td>
                  <Badge tone="success">{row.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
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
                  notify('success', 'Plan updated.')
                }, 700)
              }}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p>This prototype does not charge a real card. The selected plan is stored locally.</p>
      </Modal>
    </AppLayout>
  )
}
