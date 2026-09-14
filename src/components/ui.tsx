import { useEffect, useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import type { DatePreset, DateRange, ToastItem } from '../types'
import { formatRangeLabel, rangeFromPreset } from '../utils/dates'
import { avatarColor, initials } from '../utils/avatar'

export function Icon({ name, filled, className }: { name: string; filled?: boolean; className?: string }) {
  return <span className={`icon${filled ? ' icon--filled' : ''}${className ? ` ${className}` : ''}`}>{name}</span>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  full?: boolean
  loading?: boolean
}

export function Button({ variant = 'primary', full, loading, className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`button button--${variant}${full ? ' button--full' : ''}${loading ? ' button--loading' : ''}${className ? ` ${className}` : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="button__spinner" /> : null}
      {children}
    </button>
  )
}

export function Card({
  children,
  header,
  className = '',
  onClick,
}: {
  children: ReactNode
  header?: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <article className={`card ${className}`.trim()} onClick={onClick} role={onClick ? 'button' : undefined}>
      {header ? <header className="card__header">{header}</header> : null}
      {children}
    </article>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, id, className, ...rest } = props
  const generated = useId()
  const inputId = id ?? generated
  if (!label) return <input id={inputId} className={`input${className ? ` ${className}` : ''}`} {...rest} />
  return (
    <label className="field" htmlFor={inputId}>
      {label}
      <input id={inputId} className={`input${className ? ` ${className}` : ''}`} {...rest} />
    </label>
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const { label, id, className, ...rest } = props
  const generated = useId()
  const inputId = id ?? generated
  const area = <textarea id={inputId} className={`input input--area${className ? ` ${className}` : ''}`} {...rest} />
  if (!label) return area
  return (
    <label className="field" htmlFor={inputId}>
      {label}
      {area}
    </label>
  )
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}) {
  return (
    <label className={`search ${className}`.trim()}>
      <Icon name="search" />
      <input type="search" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'success' | 'danger' | 'pending' | 'warning' | 'info' | 'neutral'
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function Avatar({
  src,
  name,
  size = 'sm',
}: {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClass = size === 'lg' ? ' avatar--lg' : size === 'md' ? ' avatar--md' : ''
  if (src) return <img className={`avatar${sizeClass}`} src={src} alt={name} />
  return (
    <span className={`avatar avatar--initials${sizeClass}`} style={{ background: avatarColor(name) }} aria-hidden>
      {initials(name) || 'N'}
    </span>
  )
}

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <nav className="tabs" aria-label="Section tabs">
      {items.map((item) => (
        <button key={item} className={`tab${value === item ? ' tab--active' : ''}`} type="button" onClick={() => onChange(item)}>
          {item}
        </button>
      ))}
    </nav>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button className="switch" type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
      <span />
    </button>
  )
}

export function Progress({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'success' | 'violet' | 'danger' | 'warning' }) {
  const className = tone === 'primary' ? 'progress' : `progress progress--${tone}`
  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref} onClick={(event) => event.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button className="icon-button" type="button" aria-label="Close" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer ? <footer>{footer}</footer> : null}
      </div>
    </div>
  )
}

export function Dropdown({
  label,
  items,
  value,
  onChange,
}: {
  label: string
  items: string[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="dropdown">
      <Button variant="secondary" type="button" onClick={() => setOpen((current) => !current)}>
        <Icon name="tune" />
        {label}: {value}
      </Button>
      {open ? (
        <div className="dropdown__menu" role="listbox">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              className={item === value ? 'is-selected' : ''}
              onClick={() => {
                onChange(item)
                setOpen(false)
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function Table({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function EmptyState({ icon = 'inbox', title, body, action }: { icon?: string; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <Icon name={icon} />
      <strong>{title}</strong>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  )
}

export function ToastStack({ toast }: { toast: ToastItem | null }) {
  if (!toast) return null
  return <div className={`toast toast--${toast.tone}`}>{toast.text}</div>
}

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'custom', label: 'Custom' },
]

export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (range: DateRange) => void
}) {
  const [open, setOpen] = useState(false)
  const [customStart, setCustomStart] = useState(value.start.slice(0, 10))
  const [customEnd, setCustomEnd] = useState(value.end.slice(0, 10))

  return (
    <div className="date-picker-wrap">
      <button className="date-picker" type="button" onClick={() => setOpen((current) => !current)}>
        <Icon name="calendar_today" />
        <span>{formatRangeLabel(value)}</span>
        <Icon name="expand_more" />
      </button>
      {open ? (
        <div className="popover date-popover" role="dialog" aria-label="Date range">
          <div className="date-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={value.preset === preset.id ? 'is-selected' : ''}
                onClick={() => {
                  if (preset.id === 'custom') {
                    onChange(rangeFromPreset('custom', { start: `${customStart}T00:00:00.000Z`, end: `${customEnd}T23:59:59.999Z` }))
                    return
                  }
                  onChange(rangeFromPreset(preset.id))
                  setOpen(false)
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="date-custom">
            <Input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} />
            <Input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} />
          </div>
          <Button
            type="button"
            onClick={() => {
              onChange(rangeFromPreset('custom', { start: `${customStart}T00:00:00.000Z`, end: `${customEnd}T23:59:59.999Z` }))
              setOpen(false)
            }}
          >
            Apply
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function AgentMark({ name, tone = 'primary' }: { name: string; tone?: 'primary' | 'warning' | 'success' | 'violet' }) {
  return (
    <span className={`agent-mark agent-mark--${tone}`} aria-hidden>
      {name.slice(0, 1)}
    </span>
  )
}
