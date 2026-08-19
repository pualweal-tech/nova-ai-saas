import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type RouteContextValue = {
  path: string
  navigate: (to: string) => void
}

const RouteContext = createContext<RouteContextValue | null>(null)

function readPath() {
  return window.location.pathname || '/'
}

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readPath)

  useEffect(() => {
    const onPop = () => setPath(readPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPath(to)
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return createElement(RouteContext.Provider, { value }, children)
}

export function useRouter() {
  const ctx = useContext(RouteContext)
  if (!ctx) throw new Error('Router missing')
  return ctx
}

export function Link({
  to,
  className,
  children,
}: {
  to: string
  className?: string
  children: ReactNode
}) {
  const { navigate, path } = useRouter()
  return createElement(
    'a',
    {
      href: to,
      className,
      'aria-current': path === to ? 'page' : undefined,
      onClick: (event: { preventDefault: () => void }) => {
        event.preventDefault()
        navigate(to)
      },
    },
    children,
  )
}
