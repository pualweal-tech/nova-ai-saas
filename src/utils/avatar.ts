const PALETTE = ['#0050CB', '#3131C1', '#008259', '#A23302', '#6063EE', '#434654']

function hashHue(value: string) {
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function avatarColor(name: string) {
  return hashHue(name || 'N')
}
