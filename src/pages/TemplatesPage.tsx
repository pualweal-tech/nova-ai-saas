import { useMemo, useState } from 'react'
import { useNova } from '../app/NovaProvider'
import { useRouter } from '../app/router'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, Dropdown, Icon, Modal, SearchInput } from '../components/ui'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../data/mock'

export function TemplatesPage() {
  const { createAnalysis } = useNova()
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

  const useTemplate = (title: string) => {
    createAnalysis(title)
    setPreview(null)
    navigate('/projects')
  }

  return (
    <AppLayout header={<Header />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Templates</h1>
            <p>Discover AI workflows and ready-to-use templates.</p>
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
        <article className="template-hero">
          <div className="template-mark">
            <Icon name="auto_awesome" />
          </div>
          <div>
            <div className="chip-row">
              <Badge tone="info">FEATURED</Badge>
              <span className="muted">45k uses</span>
            </div>
            <h2 style={{ fontSize: 24, margin: '8px 0' }}>Enterprise Content Suite</h2>
            <p className="muted">A connected marketing workflow for blog posts, social, and brand-consistent campaigns.</p>
          </div>
          <Button type="button" onClick={() => useTemplate('Enterprise Content Suite')}>
            Use Template →
          </Button>
        </article>
        {list.length === 0 ? (
          <div className="empty-state">No templates found. Try another category.</div>
        ) : (
          <div className="template-grid">
            {list.map((item) => (
              <button key={item.id} className="template-card card--interactive" type="button" onClick={() => setPreview(item)}>
                <div className="template-card__top">
                  <span className="template-icon">
                    <Icon name={item.icon} />
                  </span>
                  <Badge tone="neutral">{item.category}</Badge>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <footer>
                  <span className="muted">{item.uses} uses</span>
                  <span className="text-button">Use →</span>
                </footer>
              </button>
            ))}
          </div>
        )}
        <h2>Recently Used</h2>
        <div className="recent-used">
          {TEMPLATES.slice(0, 2).map((item) => (
            <article key={item.id}>
              <span className="template-icon">
                <Icon name={item.icon} />
              </span>
              <div>
                <strong>{item.title}</strong>
                <small className="muted">Used 2 hours ago</small>
              </div>
              <button className="play-button" type="button" aria-label={`Use ${item.title}`} onClick={() => useTemplate(item.title)}>
                <Icon name="play_arrow" />
              </button>
            </article>
          ))}
        </div>
      </div>
      <Modal
        open={Boolean(preview)}
        title={preview?.title ?? 'Template'}
        onClose={() => setPreview(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setPreview(null)}>
              Close
            </Button>
            <Button type="button" onClick={() => preview && useTemplate(preview.title)}>
              Use template
            </Button>
          </>
        }
      >
        <p>{preview?.description}</p>
        <p className="muted">Category: {preview?.category} · {preview?.uses} uses</p>
      </Modal>
    </AppLayout>
  )
}
