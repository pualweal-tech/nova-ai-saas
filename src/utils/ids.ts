export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function nowIso() {
  return new Date().toISOString()
}

export function clockStamp(date = new Date()) {
  return date.toISOString().slice(11, 23).replace('T', '')
}
