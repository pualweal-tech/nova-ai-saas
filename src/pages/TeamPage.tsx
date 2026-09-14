import { useMemo, useState } from 'react'
import { AppLayout, Header } from '../components/layout'
import { AgentMark, Avatar, Badge, Button, Dropdown, EmptyState, Icon, Input, Modal, Progress, Table } from '../components/ui'
import { useNova } from '../app/NovaProvider'
import { ROLE_OPTIONS } from '../data/seed'
import { relativeTime } from '../utils/dates'
import type { Member } from '../types'

export function TeamPage() {
  const { members, inviteMember, updateMember, removeMember, notify } = useNova()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [edit, setEdit] = useState<Member | null>(null)
  const [removeId, setRemoveId] = useState<string | null>(null)
  const [logOpen, setLogOpen] = useState(false)
  const [taskOpen, setTaskOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Member['role']>('AI User')
  const [error, setError] = useState('')

  const filtered = useMemo(
    () =>
      members.filter((member) => {
        const haystack = `${member.name} ${member.email} ${member.role}`.toLowerCase()
        return (
          haystack.includes(query.toLowerCase()) &&
          (roleFilter === 'All roles' || member.role === roleFilter) &&
          (statusFilter === 'All status' || member.status === statusFilter)
        )
      }),
    [members, query, roleFilter, statusFilter],
  )

  const agents = [
    { name: 'Nexus', role: 'Product Agent', tone: 'primary' as const, status: 'IDLE', caps: ['市场分析', '需求规划', '用户画像挖掘'], task: '2024 Q4 核心功能需求文档生成', progress: 100 },
    { name: 'Aura', role: 'Design Agent', tone: 'warning' as const, status: 'PROCESSING', caps: ['UX/UI 设计', 'Design System 维护', '动效原型'], task: "生成 '数据大屏' 组件变体样式表", progress: 65 },
    { name: 'Cipher', role: 'Developer Agent', tone: 'success' as const, status: 'DEPLOYING', caps: ['代码生成 (React)', '自动化部署', '接口调试'], task: '执行 PR #4092 自动构建与服务器部署', progress: 90 },
  ]

  return (
    <AppLayout header={<Header searchPlaceholder="Search team members or tasks..." searchValue={query} onSearch={setQuery} />}>
      <div className="page-shell">
        <section className="page-heading" style={{ borderBottom: 'var(--border)', paddingBottom: 24 }}>
          <div>
            <div className="eyebrow">
              <Icon name="hub" />
              System Core
            </div>
            <h1>AI 团队管理</h1>
            <p>监控自主协作的代理集群状态。分配战略目标，审查输出质量，并实时干预核心工作流。</p>
          </div>
          <div className="page-heading__actions">
            <Button variant="secondary" type="button" onClick={() => setLogOpen(true)}>
              <Icon name="history" />
              任务日志
            </Button>
            <Button type="button" onClick={() => setTaskOpen(true)}>
              <Icon name="add" />
              新建任务指派
            </Button>
          </div>
        </section>

        <div className="agent-grid">
          {agents.map((agent) => (
            <article key={agent.name} className="agent-card">
              <div className="agent-card__head">
                <div className="agent-card__person">
                  <AgentMark name={agent.name} tone={agent.tone} />
                  <div>
                    <h3>{agent.name}</h3>
                    <div className="muted">{agent.role}</div>
                  </div>
                </div>
                <Badge tone={agent.status === 'PROCESSING' ? 'warning' : 'success'}>{agent.status}</Badge>
              </div>
              <p className="eyebrow">核心能力</p>
              <div className="cap-row">
                {agent.caps.map((cap) => (
                  <span key={cap}>{cap}</span>
                ))}
              </div>
              <p className="eyebrow">当前任务 {agent.progress < 100 ? `${agent.progress}%` : ''}</p>
              <div className="task-box">
                <p>{agent.task}</p>
                {agent.progress < 100 ? <Progress value={agent.progress} tone={agent.tone === 'success' ? 'success' : 'warning'} /> : <p className="muted">10分钟前完成</p>}
              </div>
            </article>
          ))}
        </div>

        <article className="card card__body">
          <div className="page-heading">
            <h2>团队协同状态流</h2>
            <span className="muted">● Live Sync</span>
          </div>
          <div className="live-strip">
            <article>
              <p className="muted">今日生成代码行数</p>
              <strong>14,289</strong>
            </article>
            <article>
              <p className="muted">UI 组件实例化次数</p>
              <strong>342</strong>
            </article>
            <article>
              <p className="muted">需求解析成功率</p>
              <strong>99.8%</strong>
            </article>
          </div>
        </article>

        <section className="page-heading">
          <div>
            <h2>Human members</h2>
            <p className="muted">Invite people, change roles, and keep the cluster accountable.</p>
          </div>
          <div className="page-heading__actions">
            <Dropdown label="Filter" items={['All roles', ...ROLE_OPTIONS]} value={roleFilter} onChange={setRoleFilter} />
            <Dropdown label="Status" items={['All status', 'Active', 'Inactive', 'Invited', 'Offline']} value={statusFilter} onChange={setStatusFilter} />
            <Button type="button" onClick={() => setInviteOpen(true)}>
              <Icon name="person_add" />
              Invite Member
            </Button>
          </div>
        </section>

        {filtered.length === 0 ? (
          <EmptyState icon="group" title="No members match those filters." />
        ) : (
          <div className="card">
            <Table columns={['Member', 'Role', 'Status', 'Last Active', 'Actions']}>
              {filtered.map((member) => (
                <tr key={member.id}>
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
                    <select className="input" value={member.role} onChange={(event) => updateMember(member.id, { role: event.target.value as Member['role'] })}>
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <Badge tone={member.status === 'Active' ? 'success' : member.status === 'Invited' ? 'info' : 'neutral'}>{member.status}</Badge>
                  </td>
                  <td className="muted">{relativeTime(member.lastActive)}</td>
                  <td>
                    <button className="icon-button" type="button" aria-label="Edit" onClick={() => setEdit(member)}>
                      <Icon name="edit" />
                    </button>
                    <button className="icon-button" type="button" aria-label="Remove" onClick={() => setRemoveId(member.id)}>
                      <Icon name="delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}
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
        <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <label className="field">
          Role
          <select className="input" value={role} onChange={(event) => setRole(event.target.value as Member['role'])}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        {error ? <p className="muted">{error}</p> : null}
      </Modal>

      <Modal
        open={Boolean(edit)}
        title="Edit member"
        onClose={() => setEdit(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!edit) return
                updateMember(edit.id, { name: edit.name, email: edit.email, role: edit.role, status: edit.status, avatar: edit.avatar })
                notify('success', 'Member updated.')
                setEdit(null)
              }}
            >
              Save
            </Button>
          </>
        }
      >
        {edit ? (
          <>
            <div className="avatar-row">
              <Avatar src={edit.avatar} name={edit.name} size="lg" />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setEdit({ ...edit, avatar: String(reader.result) })
                  reader.readAsDataURL(file)
                }}
              />
            </div>
            <Input label="Name" value={edit.name} onChange={(event) => setEdit({ ...edit, name: event.target.value })} />
            <Input label="Email" value={edit.email} onChange={(event) => setEdit({ ...edit, email: event.target.value })} />
            <label className="field">
              Status
              <select className="input" value={edit.status} onChange={(event) => setEdit({ ...edit, status: event.target.value as Member['status'] })}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Invited</option>
                <option>Offline</option>
              </select>
            </label>
          </>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(removeId)}
        title="Remove member"
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
                if (removeId) removeMember(removeId)
                setRemoveId(null)
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p>They will lose access to this workspace immediately.</p>
      </Modal>

      <Modal open={logOpen} title="任务日志" onClose={() => setLogOpen(false)}>
        <p>Nexus completed Q4 PRD · Aura processing design tokens · Cipher deploying PR #4092.</p>
      </Modal>

      <Modal
        open={taskOpen}
        title="新建任务指派"
        onClose={() => setTaskOpen(false)}
        footer={
          <Button type="button" onClick={() => { notify('success', 'Task assigned to Aura.'); setTaskOpen(false) }}>
            Assign
          </Button>
        }
      >
        <p>Assign a strategic goal to an Agent cluster node. This prototype queues the job locally.</p>
      </Modal>
    </AppLayout>
  )
}
