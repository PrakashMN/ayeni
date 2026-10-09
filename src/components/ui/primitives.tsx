import type { ReactNode } from 'react'
import type { Severity } from '../../data/types'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-card border border-cyan-200/80 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}

export function CardHeader({
  title,
  action,
  description,
}: {
  title: string
  action?: ReactNode
  description?: string
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-cyan-100 px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-cyan-900">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-cyan-700">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-cyan-950 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-cyan-700 sm:text-base">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

const severityStyles: Record<Severity, string> = {
  normal: 'bg-emerald-50 text-emerald-800 ring-emerald-600/25',
  abnormal: 'bg-amber-50 text-amber-900 ring-amber-600/30',
  critical: 'bg-red-50 text-red-800 ring-red-600/30',
}

const severityDot: Record<Severity, string> = {
  normal: 'bg-emerald-600',
  abnormal: 'bg-amber-600',
  critical: 'bg-red-600',
}

export function StatusPill({
  severity,
  children,
}: {
  severity: Severity
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${severityStyles[severity]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${severityDot[severity]}`} aria-hidden="true" />
      {children}
    </span>
  )
}

const neutralBadges: Record<string, string> = {
  neutral: 'bg-cyan-100 text-cyan-800 ring-cyan-600/25',
  brand: 'bg-cyan-700 text-white ring-cyan-700/30',
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: keyof typeof neutralBadges
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${neutralBadges[tone]}`}
    >
      {children}
    </span>
  )
}

export function Avatar({
  initials,
  name,
  size = 'md',
}: {
  initials: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  }
  return (
    <span
      className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-full bg-cyan-100 font-semibold text-cyan-800 ring-1 ring-cyan-200`}
      aria-hidden="true"
      title={name}
    >
      {initials}
    </span>
  )
}

export function MetricTile({
  label,
  value,
  hint,
  severity = 'normal',
  icon,
}: {
  label: string
  value: string | number
  hint?: string
  severity?: Severity
  icon?: ReactNode
}) {
  const accents: Record<Severity, string> = {
    normal: 'border-l-emerald-600',
    abnormal: 'border-l-amber-500',
    critical: 'border-l-red-600',
  }
  return (
    <div
      className={`rounded-card border border-l-4 border-cyan-200/80 bg-white p-4 shadow-sm ${accents[severity]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-cyan-700">{label}</p>
        {icon ? <span className="text-cyan-500">{icon}</span> : null}
      </div>
      <p className="tabular mt-1.5 text-2xl font-bold text-cyan-950">{value}</p>
      {hint ? <p className="mt-1 text-xs text-cyan-700">{hint}</p> : null}
    </div>
  )
}

export function ProgressBar({
  value,
  max,
  label,
  severity = 'normal',
}: {
  value: number
  max: number
  label: string
  severity?: Severity
}) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  const bars: Record<Severity, string> = {
    normal: 'bg-emerald-600',
    abnormal: 'bg-amber-500',
    critical: 'bg-red-600',
  }
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-cyan-800">
        <span className="font-medium">{label}</span>
        <span className="tabular">
          {value} / {max}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-cyan-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={`h-full rounded-full ${bars[severity]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="rounded-card border border-dashed border-cyan-300 bg-cyan-50/60 p-8 text-center">
      <p className="font-medium text-cyan-900">{message}</p>
      {hint ? <p className="mt-1 text-sm text-cyan-700">{hint}</p> : null}
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'secondary',
  type = 'button',
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const variants = {
    primary:
      'bg-cyan-700 text-white hover:bg-cyan-800 disabled:bg-cyan-300',
    secondary:
      'bg-white text-cyan-800 ring-1 ring-inset ring-cyan-300 hover:bg-cyan-50 disabled:text-cyan-400',
    ghost: 'text-cyan-800 hover:bg-cyan-100 disabled:text-cyan-400',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
