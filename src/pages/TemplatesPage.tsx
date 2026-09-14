import { useMemo, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, Dropdown, EmptyState, Icon, Modal, SearchInput } from '../components/ui'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/seed'
import { useNova } from '../app/NovaProvider'
import { useRouter } from '../app/router'

export function TemplatesPage() {
  const { createProject, sendCommand } = useNova()
  const { navigate } = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Popular')
  const [preview, setPreview] = useState<(typeof TEMPLATES)[number] | null>(null)

  const list = useMemo(() => {
    const next = TEMPLATES.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesQuery = `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
    if (sort === 'Name') return [...next].sort((a, b) => a.title.localeCompare(b.title))
    return next
  }, [category, query, sort])

  const useTemplate = (item: (typeof TEMPLATES)[number]) => {
    const project = createProject({ name: item.title, description: item.description, idea: item.prompt, icon: item.icon, status: 'DRAFT' })
    sendCommand(project.id, item.prompt)
    setPreview(null)
    navigate(`/projects/${project.id}`)
  }

  return (
    <AppLayout header={<Header />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Templates</h1>
            <p>Start from a product brief. NOVA fills the Agent pipeline.</p>
          </div>
        </section>
        <SearchInput value={query} onChange={setQuery} placeholder="Search AI templates..." />
        <div className="chip-row">
          {TEMPLATE_CATEGORIES.map((item) => (
            <button key={item} className={`chip${category === item ? ' chip--active' : ''}`} type="button" onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <Dropdown label="Sort" items={['Popular', 'Name']} value={sort} onChange={setSort} />
          </div>
        </div>
        {list.length === 0 ? (
          <EmptyState icon="dashboard_customize" title="No templates found. Try another category." />
        ) : (
          <div className="template-grid">
            {list.map((item) => (
              <button key={item.id} className="card template-card card--interactive" type="button" onClick={() => setPreview(item)}>
                <span className="template-icon">
                  <Icon name={item.icon} />
                </span>
                <Badge tone="neutral">{item.category}</Badge>
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
                <small className="muted">{item.uses} uses</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <Modal
        open={Boolean(preview)}
        title={preview?.title ?? 'Template'}
        onClose={() => setPreview(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setPreview(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => preview && useTemplate(preview)}>
              Use Template
            </Button>
          </>
        }
      >
        <p>{preview?.description}</p>
        <p className="muted">{preview?.prompt}</p>
      </Modal>
    </AppLayout>
  )
}
