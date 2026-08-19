import { useMemo, useState } from 'react'
import { useNova } from '../app/NovaProvider'
import { AppLayout, Header } from '../components/layout'
import { Avatar, Button, Card, Dropdown, Icon, Input, Modal, SearchInput, Table } from '../components/ui'
import { ROLES, TEAM_METRICS } from '../data/mock'

const ROLE_OPTIONS = ['Admin', 'Developer', 'Project Manager', 'Designer', 'AI User', 'Viewer']

export function TeamPage() {
  const { members, inviteOpen, setInviteOpen, inviteMember, updateMemberRole } = useNova()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('AI User')
  const [error, setError] = useState('')

  const filtered = useMemo(
    () =>
      members.filter((member) => {
        const haystack = `${member.name} ${member.email} ${member.role}`.toLowerCase()
        const matchesQuery = haystack.includes(query.toLowerCase())
        const matchesRole = roleFilter === 'All roles' || member.role === roleFilter
        return matchesQuery && matchesRole
      }),
    [members, query, roleFilter],
  )

  return (
    <AppLayout header={<Header />}>
      <div className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Team</h1>
            <p>Manage your team members, roles, and collaboration settings.</p>
          </div>
          <div className="page-heading__actions">
            <SearchInput value={query} onChange={setQuery} placeholder="Search members..." />
            <Dropdown label="Filter" items={['All roles', ...ROLE_OPTIONS]} value={roleFilter} onChange={setRoleFilter} />
            <Button type="button" onClick={() => setInviteOpen(true)}>
              <Icon name="add" />
              Invite Member
            </Button>
          </div>
        </section>
        <section className="metrics">
          {TEAM_METRICS.map((item) => (
            <article key={item.label} className="metric-card">
              <div className="metric-card__title">
                {item.label}
                <Icon name={item.icon} />
              </div>
              <div className="metric-card__value">
                {item.value}
                <span className={`trend ${item.delta.includes('0%') ? 'trend--down' : 'trend--up'}`}>{item.delta}</span>
              </div>
            </article>
          ))}
        </section>
        <div className="team-layout">
          <Card header={<h2>Members</h2>}>
            {filtered.length === 0 ? (
              <div className="empty-state">No members match those filters.</div>
            ) : (
              <Table columns={['Member', 'Role', 'Status', 'Last Active', 'Actions']}>
                {filtered.map((member) => (
                  <tr key={member.email}>
                    <td>
                      <span className="member-cell">
                        <Avatar src={member.avatar} name={member.name} />
                        <span>
                          <strong>{member.name}</strong>
                          <small>{member.email}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <select
                        className="input"
                        value={member.role}
                        onChange={(event) => updateMemberRole(member.email, event.target.value)}
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="customer">
                        <span className={`status-dot${member.status === 'Offline' ? ' status-dot--offline' : member.status === 'Invited' ? ' status-dot--invited' : ''}`} />
                        {member.status}
                      </span>
                    </td>
                    <td className="muted">{member.lastActive}</td>
                    <td>
                      <button className="icon-button" type="button" aria-label="Member actions">
                        <Icon name="more_horiz" />
                      </button>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
          <div>
            <Card header={<h2>Recent Activity</h2>}>
              <div className="card__body timeline">
                <article>
                  <strong>John created a new AI project</strong>
                  <small>10 mins ago</small>
                </article>
                <article>
                  <strong>Sarah updated analytics settings</strong>
                  <small>1 hour ago</small>
                </article>
                <article>
                  <strong>Mike joined the workspace</strong>
                  <small>Yesterday</small>
                </article>
              </div>
            </Card>
            <Card header={<h2>Roles & Permissions</h2>}>
              <div className="card__body">
                {ROLES.map((item) => (
                  <article key={item.title} className="role-card">
                    <strong>
                      {item.title} ({item.count} users)
                    </strong>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        open={inviteOpen}
        title="Invite member"
        onClose={() => setInviteOpen(false)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!name.trim() || !email.includes('@')) {
                  setError('Enter a name and valid email.')
                  return
                }
                inviteMember({ name, email, role })
                setName('')
                setEmail('')
                setError('')
                setInviteOpen(false)
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="field">
          Role
          <select className="input" value={role} onChange={(event) => setRole(event.target.value)}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        {error ? <p className="error-state">{error}</p> : null}
      </Modal>
    </AppLayout>
  )
}
