import { useMemo, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { Badge, Button, DateRangePicker, EmptyState, Icon, Input, Modal, TextArea } from '../components/ui'
import { useNova } from '../app/NovaProvider'
import { useRouter } from '../app/router'
import { inRange, relativeTime } from '../utils/dates'
import type { ProjectStatus } from '../types'

export function ProjectsPage() {
  const { projects, createProject, updateProject, deleteProject, dateRange, setDateRange } = useNova()
  const { navigate } = useRouter()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | ProjectStatus>('All')
  const [sort, setSort] = useState<'Updated' | 'Name'>('Updated')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [removeId, setRemoveId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nextStatus, setNextStatus] = useState<ProjectStatus>('DRAFT')
  const [nextDate, setNextDate] = useState(new Date().toISOString().slice(0, 10))
  const [busy, setBusy] = useState(false)

  const rows = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchQuery = `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase())
      const matchStatus = status === 'All' || project.status === status
      const matchDate = inRange(project.updatedAt, dateRange)
      return matchQuery && matchStatus && matchDate
    })
    return [...filtered].sort((a, b) => (sort === 'Name' ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt)))
  }, [projects, query, status, sort, dateRange])

  const editing = projects.find((project) => project.id === editId)

  const openCreate = () => {
    setName('')
    setDescription('')
    setNextStatus('DRAFT')
    setNextDate(new Date().toISOString().slice(0, 10))
    setCreateOpen(true)
  }

  const openEdit = (id: string) => {
    const project = projects.find((item) => item.id === id)
    if (!project) return
    setEditId(id)
    setName(project.name)
    setDescription(project.description)
    setNextStatus(project.status)
    setNextDate(project.createdAt.slice(0, 10))
  }

  return (
    <AppLayout header={<Header searchPlaceholder="Search projects..." searchValue={query} onSearch={setQuery} />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Projects</h1>
            <p>Create, inspect, and ship product workspaces.</p>
          </div>
          <div className="page-heading__actions">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Button type="button" onClick={openCreate}>
              <Icon name="add" />
              New Project
            </Button>
          </div>
        </section>
        <div className="project-toolbar">
          {(['All', 'ACTIVE', 'DRAFT'] as const).map((item) => (
            <button key={item} className={`chip${status === item ? ' chip--active' : ''}`} type="button" onClick={() => setStatus(item)}>
              {item}
            </button>
          ))}
          <Button variant="secondary" type="button" onClick={() => setSort(sort === 'Name' ? 'Updated' : 'Name')}>
            Sort: {sort}
          </Button>
          <Button variant="ghost" type="button" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            <Icon name={view === 'grid' ? 'view_list' : 'grid_view'} />
            {view === 'grid' ? 'List' : 'Grid'}
          </Button>
        </div>
        {rows.length === 0 ? (
          <EmptyState icon="folder_open" title="No projects match" body="Try another search, status, or date range." action={<Button type="button" onClick={openCreate}>Create project</Button>} />
        ) : view === 'grid' ? (
          <div className="project-bento">
            {rows.map((project) => (
              <article key={project.id} className="project-tile" style={{ height: 160 }}>
                <div className="project-tile__top">
                  <Icon name={project.icon} />
                  <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>{project.status}</Badge>
                </div>
                <h3>{project.name}</h3>
                <p>
                  {project.version} • {relativeTime(project.updatedAt)}
                </p>
                <div className="page-heading__actions" style={{ marginTop: 8 }}>
                  <Button type="button" onClick={() => navigate(`/projects/${project.id}`)}>
                    Open
                  </Button>
                  <Button variant="secondary" type="button" onClick={() => openEdit(project.id)}>
                    Edit
                  </Button>
                  <Button variant="danger" type="button" onClick={() => setRemoveId(project.id)}>
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.name}</strong>
                      <div className="muted">{project.description}</div>
                    </td>
                    <td>
                      <Badge tone={project.status === 'ACTIVE' ? 'success' : 'neutral'}>{project.status}</Badge>
                    </td>
                    <td className="muted">{relativeTime(project.updatedAt)}</td>
                    <td>
                      <button className="text-button" type="button" onClick={() => navigate(`/projects/${project.id}`)}>
                        Open
                      </button>
                      <button className="text-button" type="button" onClick={() => openEdit(project.id)}>
                        Edit
                      </button>
                      <button className="text-button" type="button" onClick={() => setRemoveId(project.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={createOpen}
        title="Create project"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              loading={busy}
              onClick={() => {
                if (!name.trim()) return
                setBusy(true)
                window.setTimeout(() => {
                  createProject({
                    name,
                    description,
                    status: nextStatus,
                    createdAt: `${nextDate}T12:00:00.000Z`,
                  })
                  setBusy(false)
                  setCreateOpen(false)
                }, 400)
              }}
            >
              Create
            </Button>
          </>
        }
      >
        <Input label="Project Name" value={name} onChange={(event) => setName(event.target.value)} />
        <TextArea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <label className="field">
          Status
          <select className="input" value={nextStatus} onChange={(event) => setNextStatus(event.target.value as ProjectStatus)}>
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
          </select>
        </label>
        <Input label="Date" type="date" value={nextDate} onChange={(event) => setNextDate(event.target.value)} />
      </Modal>

      <Modal
        open={Boolean(editing)}
        title="Edit project"
        onClose={() => setEditId(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setEditId(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!editId) return
                updateProject(editId, { name, description, status: nextStatus, createdAt: `${nextDate}T12:00:00.000Z` })
                setEditId(null)
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Input label="Project Name" value={name} onChange={(event) => setName(event.target.value)} />
        <TextArea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <label className="field">
          Status
          <select className="input" value={nextStatus} onChange={(event) => setNextStatus(event.target.value as ProjectStatus)}>
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
          </select>
        </label>
        <Input label="Date" type="date" value={nextDate} onChange={(event) => setNextDate(event.target.value)} />
      </Modal>

      <Modal
        open={Boolean(removeId)}
        title="Delete project"
        onClose={() => setRemoveId(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setRemoveId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              onClick={() => {
                if (removeId) deleteProject(removeId)
                setRemoveId(null)
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>This removes the project from this workspace. You can recreate it later from Dashboard.</p>
      </Modal>
    </AppLayout>
  )
}
