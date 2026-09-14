const STORAGE_KEY = 'nova-2.0-state'

export function loadState<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) }
  } catch {
    return fallback
  }
}

export function saveState<T>(value: T) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* private mode / quota */
  }
}
