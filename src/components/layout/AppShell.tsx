import { Bell, ChevronDown, HeartPulse, LogOut, Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { users } from '../../data/api'
import { navItems } from './nav'

function initialsOf(name: string): string {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const roleToUserRole: Record<string, string> = {
  Patient: 'patient',
  Clinician: 'doctor',
  Nursing: 'staff',
  Diagnostics: 'lab',
  Pharmacy: 'pharmacy',
  'Front desk': 'receptionist',
  Administration: 'admin',
}

function currentUser(role: string) {
  const match = roleToUserRole[role]
  return (
    users.find((u) => u.role === match && u.status === 'active') ??
    users.find((u) => u.status === 'active') ??
    users[0]
  )
}

function Brand({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-800 text-white shadow-lg shadow-cyan-900/20">
        <HeartPulse className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className={`block text-sm font-bold ${onDark ? 'text-white' : 'text-cyan-950'}`}>
          Medora EHR
        </span>
        <span className={`block text-xs ${onDark ? 'text-cyan-200' : 'text-cyan-800'}`}>
          Better Care. Together.
        </span>
      </span>
    </div>
  )
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboards" className="flex-1 overflow-y-auto px-4 py-5">
      <ul className="space-y-1.5">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex min-h-11 cursor-pointer items-start gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-900/30'
                    : 'text-white hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      isActive ? 'text-white' : 'text-cyan-200 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{item.label}</span>
                    <span
                      className={`mt-0.5 block truncate text-xs leading-snug ${
                        isActive ? 'text-white/90' : 'text-cyan-300'
                      }`}
                    >
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

function SidebarFooter() {
  const navigate = useNavigate()
  return (
    <div className="border-t border-white/15 px-5 py-5">
      <div className="flex items-center gap-2 text-cyan-200">
        <HeartPulse className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-semibold text-white">Medora EHR</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed font-medium text-cyan-300">Secure • Compliant • Patient Centred</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-3 flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-sm font-semibold text-cyan-100 transition-colors duration-200 hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log out
      </button>
    </div>
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
  const role = active?.role ?? 'Overview'
  const user = currentUser(role)
  const initials = initialsOf(user.name)

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[290px_1fr]">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/10 bg-[#003D38] lg:flex">
        <div className="flex h-16 items-center border-b border-white/15 px-4">
          <Brand onDark />
        </div>
        <NavList />
        <SidebarFooter />
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-cyan-950/60 backdrop-blur-sm"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            id="medora-mobile-nav"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-[#003D38] shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-white/15 px-4">
              <Brand onDark />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-cyan-100 transition-colors duration-200 hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <NavList onNavigate={() => setDrawerOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-cyan-200/70 bg-white/85 shadow-sm shadow-cyan-900/5 backdrop-blur">
          <div className="flex h-18 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="medora-mobile-nav"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-cyan-800 transition-colors duration-200 hover:bg-cyan-100 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="lg:hidden">
              <Brand />
            </div>

            <div className="hidden min-w-0 flex-col justify-center lg:flex">
              <span className="text-xs font-medium text-cyan-600">Dashboards</span>
              <span className="truncate text-lg leading-tight font-bold tracking-tight text-cyan-950">
                {role}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
              <label className="relative hidden md:block">
                <span className="sr-only">Search patients, reports and orders</span>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search patients, reports, appointments…"
                  className="h-11 w-80 rounded-xl border border-cyan-200 bg-cyan-50/60 pr-4 pl-10 text-sm text-cyan-900 shadow-inner shadow-cyan-900/5 placeholder:text-cyan-500 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                />
              </label>

              <button
                type="button"
                aria-label="Notifications, 2 unread"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-cyan-700 transition-colors duration-200 hover:bg-cyan-100"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span
                  className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-cyan-100"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 text-sm font-bold text-white ring-2 ring-cyan-100">
                  {initials}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-xs leading-tight text-cyan-600">Signed in as</span>
                  <span className="mt-0.5 block text-sm leading-tight font-semibold text-cyan-950">
                    {user.name}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-cyan-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="app-canvas flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
