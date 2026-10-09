import { HeartPulse, Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router'
import { navItems } from './nav'

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-700 text-white">
        <HeartPulse className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-bold text-white">Medora EHR</span>
        <span className="block text-xs text-cyan-300">Unified health record</span>
      </span>
    </div>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboards" className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 ${
                  isActive
                    ? 'bg-cyan-700/40 text-white ring-1 ring-cyan-400/40'
                    : 'text-cyan-200 hover:bg-cyan-800/40 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      isActive ? 'text-cyan-200' : 'text-cyan-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="block truncate text-xs text-cyan-300">
                      {item.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.activeElement as HTMLElement | null
    const container = drawerRef.current
    const focusables = () =>
      container
        ? Array.from(
            container.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])',
            ),
          )
        : []

    focusables()[0]?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [drawerOpen])

  const active = navItems.find((i) => i.to === location.pathname)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <aside className="sticky top-0 hidden h-screen flex-col bg-cyan-950 lg:flex">
        <div className="flex h-16 items-center border-b border-cyan-800/60 px-4">
          <Brand />
        </div>
        <NavList />
        <p className="border-t border-cyan-800/60 px-5 py-4 text-xs text-cyan-400">
          Demo environment. All records are synthetic.
        </p>
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-cyan-950/60"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            id="medora-mobile-nav"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-cyan-950 shadow-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-cyan-800/60 px-4">
              <Brand />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-cyan-200 transition-colors duration-200 hover:bg-cyan-800/50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <NavList onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-cyan-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="medora-mobile-nav"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-cyan-800 transition-colors duration-200 hover:bg-cyan-100 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="lg:hidden">
              <Brand />
            </div>

            <div className="ml-auto hidden items-center gap-3 md:flex">
              <label className="relative block">
                <span className="sr-only">Search patients, reports and orders</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-cyan-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search patients, reports…"
                  className="h-11 w-64 rounded-lg border border-cyan-200 bg-white pr-3 pl-9 text-sm text-cyan-900 placeholder:text-cyan-500"
                />
              </label>
              <span className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-800">
                Signed in as {active?.role ?? 'Guest'}
              </span>
            </div>
          </div>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
