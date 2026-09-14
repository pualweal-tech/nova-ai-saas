import type { DatePreset, DateRange } from '../types'

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

export function toIso(date: Date) {
  return date.toISOString()
}

export function rangeFromPreset(preset: DatePreset, custom?: { start: string; end: string }): DateRange {
  const today = new Date()
  if (preset === 'today') {
    return { preset, start: toIso(startOfDay(today)), end: toIso(endOfDay(today)) }
  }
  if (preset === 'yesterday') {
    const day = new Date(today)
    day.setDate(day.getDate() - 1)
    return { preset, start: toIso(startOfDay(day)), end: toIso(endOfDay(day)) }
  }
  if (preset === '7d') {
    const start = new Date(today)
    start.setDate(start.getDate() - 6)
    return { preset, start: toIso(startOfDay(start)), end: toIso(endOfDay(today)) }
  }
  if (preset === '30d') {
    const start = new Date(today)
    start.setDate(start.getDate() - 29)
    return { preset, start: toIso(startOfDay(start)), end: toIso(endOfDay(today)) }
  }
  return {
    preset: 'custom',
    start: custom?.start ?? toIso(startOfDay(today)),
    end: custom?.end ?? toIso(endOfDay(today)),
  }
}

export function inRange(iso: string, range: DateRange) {
  const time = new Date(iso).getTime()
  return time >= new Date(range.start).getTime() && time <= new Date(range.end).getTime()
}

export function dayCount(range: DateRange) {
  const ms = new Date(range.end).getTime() - new Date(range.start).getTime()
  return Math.max(1, Math.round(ms / 86400000) + 1)
}

export function relativeTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(delta / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function formatRangeLabel(range: DateRange) {
  const start = new Date(range.start)
  const end = new Date(range.end)
  const fmt = (date: Date) => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  if (range.preset === 'today') return 'Today'
  if (range.preset === 'yesterday') return 'Yesterday'
  if (range.preset === '7d') return 'Last 7 days'
  if (range.preset === '30d') return 'Last 30 days'
  return `${fmt(start)} – ${fmt(end)}`
}

export function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 3600000).toISOString()
}

export function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString()
}
