import { useEffect, useId, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

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
}: {
  children: ReactNode
  header?: ReactNode
  className?: string
}) {
  return (
    <article className={`card ${className}`.trim()}>
      {header ? <header className="card__header">{header}</header> : null}
      {children}
    </article>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, id, ...rest } = props
  const generated = useId()
  const inputId = id ?? generated
  if (!label) return <input id={inputId} className="input" {...rest} />
  return (
    <label className="field" htmlFor={inputId}>
      {label}
      <input id={inputId} {...rest} />
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
  size?: 'sm' | 'lg'
}) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  if (src) return <img className={`avatar${size === 'lg' ? ' avatar--lg' : ''}`} src={src} alt={name} />
  return (
    <span className={`avatar avatar--initials${size === 'lg' ? ' avatar--lg' : ''}`} aria-hidden>
      {initials}
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

export function Progress({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'success' | 'violet' | 'danger' }) {
  const className = tone === 'primary' ? 'progress' : `progress progress--${tone}`
  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${value}%` }} />
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

export function ChartContainer({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card header={<><h2>{title}</h2>{action}</>}>
      <div className="chart-container">{children}</div>
    </Card>
  )
}

export function Table({
  columns,
  children,
}: {
  columns: string[]
  children: ReactNode
}) {
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
