import {
  Activity,
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Cloud,
  Fingerprint,
  FlaskConical,
  Globe,
  HeartPulse,
  KeyRound,
  Layers,
  Lock,
  Mail,
  Menu,
  MessageSquare,
  Pill,
  PlayCircle,
  Plug,
  Quote,
  Server,
  ShieldCheck,
  ShieldHalf,
  Sparkles,
  Star,
  Stethoscope,
  UserRound,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

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

function Eyebrow({
  children,
  icon: Icon,
  dark = false,
}: {
  children: ReactNode
  icon?: LucideIcon
  dark?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${
        dark
          ? 'bg-white/10 text-cyan-100 ring-white/20 backdrop-blur'
          : 'bg-cyan-100 text-cyan-800 ring-cyan-600/20'
      }`}
    >
      {Icon ? (
        <Icon className={`h-3.5 w-3.5 ${dark ? 'text-cyan-300' : ''}`} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  onDark = false,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
  onDark?: boolean
}) {
  const alignment = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'
  return (
    <div className={alignment}>
      <span
        className={`text-xs font-bold tracking-wider uppercase ${
          onDark ? 'text-cyan-300' : 'text-cyan-600'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${
          onDark ? 'text-white' : 'text-cyan-950'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed ${onDark ? 'text-cyan-200' : 'text-cyan-800'}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'How it works', href: '#how' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const trustedBy = ['Apex Health', 'Meridian Clinic', 'Grace Hospital', 'NorthCare', 'St. Luke', 'Vita Group']

const heroStats = [
  { value: '38%', label: 'Less admin time', icon: Clock },
  { value: '2.4x', label: 'Faster lab turnaround', icon: FlaskConical },
  { value: '99.98%', label: 'Platform uptime', icon: Activity },
  { value: '7', label: 'Role-based workspaces', icon: Layers },
]

const platformFeatures: {
  icon: LucideIcon
  title: string
  body: string
  span?: string
  points?: string[]
}[] = [
  {
    icon: Layers,
    title: 'One longitudinal patient record',
    body: 'Demographics, encounters, vitals, labs, prescriptions, imaging and billing consolidated into a single timeline that every authorised team can trust.',
    span: 'lg:col-span-2',
    points: ['Longitudinal timeline', 'Problem summaries', 'Document vault'],
  },
  {
    icon: MessageSquare,
    title: 'AI-assisted summaries',
    body: 'Draft clinical notes and discharge summaries from structured data — always clinician-reviewed before they land.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & reporting',
    body: 'Live dashboards for volume, revenue, turnaround times and clinical quality indicators.',
  },
  {
    icon: Workflow,
    title: 'Smart task delegation',
    body: 'Route duties to the right desk, track progress and prevent work slipping through the cracks.',
  },
  {
    icon: CalendarClock,
    title: 'Unified scheduling',
    body: 'OPD, IPD and follow-ups coordinated across departments, channels and providers.',
  },
  {
    icon: Plug,
    title: 'Interoperable by design',
    body: 'Connect labs, devices, payments and messaging through open, standards-based interfaces.',
    span: 'lg:col-span-2',
  },
]

const steps = [
  {
    icon: Globe,
    step: '01',
    title: 'Connect your services',
    body: 'Import patient records, link lab analysers, payment gateways and messaging channels in days — not months.',
  },
  {
    icon: Users,
    step: '02',
    title: 'Configure roles & workflows',
    body: 'Map your teams to the seven role-based workspaces and tailor each flow to how your facility actually runs.',
  },
  {
    icon: PlayCircle,
    step: '03',
    title: 'Go live with confidence',
    body: 'Train in a sandbox, migrate safely with guided onboarding and launch with 24/7 support behind you.',
  },
]

const solutions: {
  icon: LucideIcon
  role: string
  tagline: string
  body: string
  bullets: string[]
  metric: { value: string; label: string }
}[] = [
  {
    icon: UserRound,
    role: 'Patient',
    tagline: 'Self-service care hub',
    body: 'Give patients a calm, mobile-first view of their health — appointments, results, medicines and reminders in one place.',
    bullets: ['Book and reschedule visits', 'View lab reports and trends', 'Order medicines and pay bills'],
    metric: { value: '71%', label: 'fewer booking calls' },
  },
  {
    icon: Stethoscope,
    role: 'Doctor',
    tagline: 'Clinical command centre',
    body: 'Review cases, triage by severity, delegate to nursing and approve AI-drafted summaries without leaving the queue.',
    bullets: ['Severity-ranked case list', 'Delegate and track tasks', 'Approve discharge summaries'],
    metric: { value: '38%', label: 'less admin time' },
  },
  {
    icon: ClipboardList,
    role: 'Nursing & Staff',
    tagline: 'Duties and vitals',
    body: 'A clear, prioritised task board for vitals checks, room prep, medication delivery and report collection.',
    bullets: ['Daily duty board', 'Capture vitals at the bedside', 'Escalate critical readings'],
    metric: { value: '2.1x', label: 'tasks completed on time' },
  },
  {
    icon: FlaskConical,
    role: 'Laboratory',
    tagline: 'Test analytics and reports',
    body: 'Track every sample from booking to report, flag abnormalities automatically and publish results with one tap.',
    bullets: ['Sample lifecycle tracking', 'Automatic result flagging', 'Branded PDF reports'],
    metric: { value: '2.4x', label: 'faster turnaround' },
  },
  {
    icon: Pill,
    role: 'Pharmacy',
    tagline: 'Inventory, orders, refills',
    body: 'Keep shelves stocked and prescriptions moving with reorder alerts, order queues and refill workflows.',
    bullets: ['Low-stock and expiry alerts', 'Order fulfilment queue', 'Prescription refills'],
    metric: { value: '99.4%', label: 'order fill rate' },
  },
  {
    icon: Bell,
    role: 'Front desk',
    tagline: 'Reception and billing',
    body: 'Check patients in, manage the waiting room and reconcile invoices without switching systems.',
    bullets: ['Fast patient check-in', 'Invoice and payment tracking', 'Multi-channel bookings'],
    metric: { value: '4 min', label: 'average check-in' },
  },
  {
    icon: ShieldCheck,
    role: 'Administration',
    tagline: 'Users, oversight, audit',
    body: 'Control access, oversee every department and export an immutable audit trail whenever you need it.',
    bullets: ['Role and permission management', 'Facility-wide oversight', 'Complete audit trail'],
    metric: { value: '100%', label: 'audit coverage' },
  },
]

const securityItems: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    body: 'AES-256 at rest and TLS 1.3 in transit, with field-level encryption for sensitive identifiers.',
  },
  {
    icon: KeyRound,
    title: 'SSO, MFA & RBAC',
    body: 'Fine-grained role-based access control with single sign-on and mandatory multi-factor authentication.',
  },
  {
    icon: ShieldHalf,
    title: 'Immutable audit trail',
    body: 'Every view and change is logged, timestamped and exportable for compliance reviews.',
  },
  {
    icon: Server,
    title: 'Regional data residency',
    body: 'Store data in your preferred region with automated backups and tested disaster recovery.',
  },
  {
    icon: Fingerprint,
    title: 'Consent & access control',
    body: 'Patient consent states govern who can see what, enforced at query time — not bolted on.',
  },
  {
    icon: Cloud,
    title: 'Resilient by default',
    body: 'Multi-zone infrastructure, continuous monitoring and a 99.98% uptime track record.',
  },
]

const testimonials = [
  {
    quote:
      'Medora replaced three disconnected systems. Our clinicians finally see one record, and lab results reach the ward before the patient does.',
    name: 'Dr. Adjoa Mensah',
    role: 'Clinical Director',
    org: 'Apex Health',
    initials: 'AM',
  },
  {
    quote:
      'Rolling out the role-based workspaces took two weeks. Staff onboarding was painless and our check-in time dropped by more than half.',
    name: 'Kwame Boateng',
    role: 'Head of Operations',
    org: 'Meridian Clinic',
    initials: 'KB',
  },
  {
    quote:
      'The audit trail and consent controls gave our compliance team real confidence. Security was never an afterthought — it is baked in.',
    name: 'Nurse Grace Owusu',
    role: 'Lead Nursing Officer',
    org: 'Grace Hospital',
    initials: 'GO',
  },
]

const integrations = [
  'HL7 / FHIR',
  'Lab analysers',
  'Payment gateways',
  'WhatsApp reminders',
  'SMS gateway',
  'Accounting suites',
  'Pharmacy suppliers',
  'Insurance claims',
]

const plans = [
  {
    name: 'Starter',
    tagline: 'For single practices going digital',
    monthly: 199,
    annual: 1990,
    highlight: false,
    features: [
      'Up to 5 clinician seats',
      'Patient & doctor dashboards',
      'Appointments & prescriptions',
      'Email support',
    ],
    cta: 'Start free trial',
  },
  {
    name: 'Clinic',
    tagline: 'For multi-department facilities',
    monthly: 499,
    annual: 4990,
    highlight: true,
    features: [
      'Up to 40 seats, all 7 roles',
      'Laboratory & pharmacy modules',
      'Billing and revenue analytics',
      'SSO, MFA and audit exports',
      'Priority support',
    ],
    cta: 'Choose Clinic',
  },
  {
    name: 'Enterprise',
    tagline: 'For hospital groups at scale',
    monthly: null,
    annual: null,
    highlight: false,
    features: [
      'Unlimited seats and sites',
      'Interoperability & device integrations',
      'Regional data residency options',
      'Dedicated success manager',
      '99.98% uptime SLA',
    ],
    cta: 'Talk to sales',
  },
]

const faqs = [
  {
    q: 'Is Medora suitable for a single clinic as well as a hospital group?',
    a: 'Yes. The Starter plan is built for sole practitioners and small clinics, while Clinic and Enterprise scale to multi-department and multi-site organisations with all seven role-based workspaces.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Most single-site facilities go live in one to two weeks. Larger groups follow a guided onboarding with sandbox training, phased data migration and dedicated support.',
  },
  {
    q: 'Can Medora connect to our existing laboratory equipment?',
    a: 'Medora supports standards-based interoperability including HL7 and FHIR, and connects to common analysers, payment gateways and messaging providers. Custom integrations are available on Enterprise.',
  },
  {
    q: 'How is patient data protected?',
    a: 'Data is encrypted at rest and in transit, access is governed by role-based permissions, and every action is written to an immutable audit trail. SSO, MFA and regional data residency are supported.',
  },
  {
    q: 'Do you support offline or low-bandwidth settings?',
    a: 'The interface is lightweight and mobile-first, designed for low-bandwidth environments. Bedside vitals capture and check-in work smoothly on tablets and phones over constrained connections.',
  },
  {
    q: 'What support is included?',
    a: 'All plans include in-app guidance and documentation. Clinic adds priority support, and Enterprise includes a dedicated success manager with a 99.98% uptime service-level agreement.',
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSolution, setActiveSolution] = useState(0)
  const [annual, setAnnual] = useState(false)
  const [overHero, setOverHero] = useState(true)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const height = heroRef.current?.offsetHeight ?? 0
      setOverHero(window.scrollY < height - 72)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solution = solutions[activeSolution]

  return (
    <div className="min-h-screen bg-white text-cyan-950">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Announcement */}
      <div className="bg-[#003D38] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-medium sm:text-sm">
          <Sparkles className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
          <span className="text-cyan-100">
            New: AI-assisted clinical summaries are now generally available.
          </span>
          <a
            href="#platform"
            className="hidden shrink-0 items-center gap-1 font-semibold text-white underline underline-offset-2 hover:text-cyan-200 sm:inline-flex"
          >
            See what's new
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Nav */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
          overHero ? 'border-white/10' : 'border-cyan-950/10'
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#top" aria-label="Medora EHR home">
            <Brand onDark={overHero} />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                  overHero
                    ? 'text-cyan-100 hover:bg-white/10 hover:text-white'
                    : 'text-cyan-900 hover:bg-cyan-950/5 hover:text-cyan-950'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`hidden min-h-11 cursor-pointer items-center rounded-xl px-4 text-sm font-semibold transition-colors duration-200 sm:inline-flex ${
                overHero
                  ? 'text-cyan-100 hover:bg-white/10 hover:text-white'
                  : 'text-cyan-900 hover:bg-cyan-950/5 hover:text-cyan-950'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate('/get-started')}
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition-colors duration-200 ${
                overHero
                  ? 'bg-white text-cyan-900 hover:bg-cyan-50'
                  : 'bg-[#003D38] text-white hover:bg-[#00342f]'
              }`}
            >
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 lg:hidden ${
                overHero
                  ? 'text-cyan-100 hover:bg-white/10 hover:text-white'
                  : 'text-cyan-900 hover:bg-cyan-950/5 hover:text-cyan-950'
              }`}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            aria-label="Mobile"
            className={`border-t px-4 py-3 backdrop-blur-xl lg:hidden ${
              overHero ? 'border-white/10 bg-[#003D38]/70' : 'border-cyan-950/10 bg-white/70'
            }`}
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-3 py-3 text-sm font-semibold ${
                      overHero ? 'text-cyan-100 hover:bg-white/10 hover:text-white' : 'text-cyan-900 hover:bg-cyan-950/5'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/get-started')
                  }}
                  className={`mt-1 block w-full cursor-pointer rounded-lg px-3 py-3 text-center text-sm font-semibold ${
                    overHero ? 'bg-white text-cyan-900' : 'bg-[#003D38] text-white'
                  }`}
                >
                  Get started
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <main id="main">
        {/* Hero */}
        <section
          id="top"
          ref={heroRef}
          className="-mt-18 relative isolate overflow-hidden bg-[#003D38] text-white"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#003D38] via-[#08211b] to-[#0c1e18]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-52 left-1/2 h-[40rem] w-[52rem] max-w-full -translate-x-1/2 rounded-full bg-cyan-500/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-20 -right-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8 lg:pt-28">
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex justify-center">
                <Eyebrow icon={Sparkles} dark>
                  Trusted by care teams in 12 countries
                </Eyebrow>
              </div>
              <h1 className="mt-7 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Better care,
                <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                  delivered together.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cyan-100 sm:text-xl">
                Medora EHR unifies patients, clinicians, laboratories, pharmacy and front desk on one
                secure platform — so every team works from the same up-to-date record.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/get-started')}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-cyan-900 shadow-lg shadow-cyan-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-50"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href="#how"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 transition-colors duration-200 hover:bg-white/10"
                >
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  See how it works
                </a>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-3">
                  <ul className="flex -space-x-2.5">
                    {['AM', 'KB', 'GO', 'IQ', 'NA'].map((initials) => (
                      <li
                        key={initials}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#08211b] bg-gradient-to-br from-cyan-400 to-cyan-600 text-xs font-bold text-white shadow-sm"
                        aria-hidden="true"
                      >
                        {initials}
                      </li>
                    ))}
                  </ul>
                  <div className="text-left">
                    <div
                      className="flex items-center gap-0.5 text-amber-400"
                      aria-label="Rated 4.9 out of 5"
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-cyan-200">
                      4.9/5 from 1,200+ clinicians
                    </p>
                  </div>
                </div>
                <span className="hidden h-8 w-px bg-white/20 sm:block" aria-hidden="true" />
                <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-cyan-100">
                  {['No credit card', 'Free 14-day trial', 'Audit-ready records'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative mx-auto mt-12 max-w-5xl">
              <div
                className="pointer-events-none absolute -inset-x-6 -top-10 bottom-4 rounded-[2.5rem] bg-cyan-400/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="[perspective:1600px]">
                <div className="relative origin-top [transform:rotateX(5deg)]">
                  <div className="overflow-hidden rounded-3xl shadow-2xl shadow-cyan-950/60 ring-1 ring-white/15">
                    <DashboardPreview />
                  </div>
                </div>
              </div>

              <div className="absolute top-28 -left-8 z-20 hidden w-56 lg:block">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-xl shadow-cyan-950/40 backdrop-blur-md">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">Appointment confirmed</p>
                    <p className="text-[11px] text-cyan-200">Dr. Mensah · 09:30</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-10 -right-8 z-20 hidden w-52 lg:block">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-xl shadow-cyan-950/40 backdrop-blur-md">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-200">
                    <FlaskConical className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">Lab result ready</p>
                    <p className="text-[11px] text-cyan-200">CBC · within range</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-28 -left-6 z-20 hidden w-48 lg:block">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-xl shadow-cyan-950/40 backdrop-blur-md">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-200">
                    <Activity className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">SpO₂ 98%</p>
                    <p className="text-[11px] text-cyan-200">Normal range</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-36 -right-6 z-20 hidden w-56 lg:block">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 shadow-xl shadow-cyan-950/40 backdrop-blur-md">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-200">
                    <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">Fully audited</p>
                    <p className="text-[11px] text-cyan-200">HIPAA-minded workflow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by */}
        <section className="border-b border-cyan-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold tracking-wider text-cyan-500 uppercase">
              Trusted by growing hospitals and clinics worldwide
            </p>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {trustedBy.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 text-base font-bold tracking-tight text-cyan-800/70"
                >
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-cyan-100 bg-cyan-50/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="card-shadow rounded-2xl border border-cyan-200/70 bg-white p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <stat.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="tabular mt-4 text-3xl font-bold tracking-tight text-cyan-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-cyan-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform */}
        <section id="platform" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <SectionHeading
              eyebrow="The platform"
              title="Everything your care team needs, in one place"
              description="Purpose-built modules for every department, backed by one shared source of truth and a consistent, accessible interface."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {platformFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className={`card-shadow group rounded-2xl border border-cyan-200/70 bg-white p-6 transition-transform duration-200 hover:-translate-y-0.5 ${feature.span ?? ''}`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-cyan-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cyan-700">{feature.body}</p>
                  {feature.points ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {feature.points.map((point) => (
                        <li
                          key={point}
                          className="inline-flex items-center gap-1.5 rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-800 ring-1 ring-inset ring-cyan-100"
                        >
                          <Check className="h-3.5 w-3.5 text-cyan-600" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 border-y border-cyan-100 bg-cyan-50/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <SectionHeading
              eyebrow="How it works"
              title="From first login to full rollout"
              description="A guided path that gets your facility live quickly, safely and without disruption to patient care."
            />
            <ol className="mt-14 grid gap-6 lg:grid-cols-3">
              {steps.map((item) => (
                <li
                  key={item.step}
                  className="card-shadow relative rounded-2xl border border-cyan-200/70 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-700 to-cyan-500 text-white">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="tabular text-3xl font-bold text-cyan-100">{item.step}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-cyan-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cyan-700">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <SectionHeading
              eyebrow="Built for every role"
              title="A dashboard shaped around how you work"
              description="Seven role-based workspaces, each focused on the tasks that matter — so nobody wades through noise."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div
                role="tablist"
                aria-label="Solutions by role"
                aria-orientation="vertical"
                className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
              >
                {solutions.map((item, index) => {
                  const selected = index === activeSolution
                  return (
                    <button
                      key={item.role}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => setActiveSolution(index)}
                      className={`flex min-h-11 shrink-0 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200 lg:w-full ${
                        selected
                          ? 'border-cyan-600 bg-cyan-700 text-white shadow-sm'
                          : 'border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-50'
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${selected ? 'text-white' : 'text-cyan-600'}`}
                        aria-hidden="true"
                      />
                      <span className="whitespace-nowrap">{item.role}</span>
                    </button>
                  )
                })}
              </div>

              <div
                role="tabpanel"
                className="card-shadow rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50/80 to-white p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-600 text-white shadow-lg shadow-cyan-900/25">
                      <solution.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-950">{solution.role}</h3>
                      <p className="text-sm font-medium text-cyan-600">{solution.tagline}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-cyan-200 bg-white px-5 py-3 text-right">
                    <p className="tabular text-2xl font-bold text-cyan-950">
                      {solution.metric.value}
                    </p>
                    <p className="text-xs font-medium text-cyan-700">{solution.metric.label}</p>
                  </div>
                </div>

                <p className="mt-5 text-base leading-relaxed text-cyan-800">{solution.body}</p>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
                  {solution.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 rounded-xl border border-cyan-100 bg-white px-3 py-3 text-sm font-medium text-cyan-800"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600"
                        aria-hidden="true"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-500 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90"
                  >
                    Open the {solution.role.toLowerCase()} dashboard
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="scroll-mt-20 bg-[#003D38] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="Security & compliance"
                  title="Patient data protected at every layer"
                  description="Medora is engineered for the realities of healthcare: strict access control, full traceability and resilient infrastructure."
                  align="left"
                  onDark
                />
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {['HIPAA-minded', 'GDPR-ready', 'ISO 27001 aligned', 'SOC 2 practices'].map(
                    (badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-100 ring-1 ring-inset ring-white/20"
                      >
                        <BadgeCheck className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                        {badge}
                      </span>
                    ),
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-8 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-cyan-800 transition-colors duration-200 hover:bg-cyan-50"
                >
                  Explore the secure workspace
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {securityItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3.5 text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-cyan-200">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <SectionHeading
              eyebrow="Loved by care teams"
              title="Results that speak for themselves"
              description="Hospitals and clinics use Medora every day to deliver faster, better-coordinated care."
            />
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {testimonials.map((item) => (
                <figure
                  key={item.name}
                  className="card-shadow flex h-full flex-col rounded-2xl border border-cyan-200/70 bg-white p-6"
                >
                  <Quote className="h-8 w-8 text-cyan-200" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-cyan-800">
                    {item.quote}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-1 text-amber-500" aria-label="5 out of 5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <figcaption className="mt-4 flex items-center gap-3 border-t border-cyan-100 pt-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 text-sm font-bold text-white">
                      {item.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-cyan-950">
                        {item.name}
                      </span>
                      <span className="block truncate text-xs text-cyan-700">
                        {item.role}, {item.org}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="border-y border-cyan-100 bg-cyan-50/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
              <SectionHeading
                eyebrow="Integrations"
                title="Fits into the systems you already run"
                description="Connect your existing ecosystem through open standards and pre-built connectors, so data flows without manual re-entry."
                align="left"
              />
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {integrations.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2.5 rounded-xl border border-cyan-200/70 bg-white px-4 py-3.5 text-sm font-semibold text-cyan-800"
                  >
                    <Plug className="h-4 w-4 shrink-0 text-cyan-600" aria-hidden="true" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <SectionHeading
              eyebrow="Pricing"
              title="Simple plans that scale with you"
              description="Start with a free trial. Upgrade when your team is ready — no hidden fees, cancel anytime."
            />

            <div className="mt-8 flex items-center justify-center gap-3">
              <span
                className={`text-sm font-semibold ${annual ? 'text-cyan-600' : 'text-cyan-950'}`}
              >
                Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                aria-label="Toggle annual billing"
                onClick={() => setAnnual((value) => !value)}
                className={`relative h-7 w-13 cursor-pointer rounded-full transition-colors duration-200 ${
                  annual ? 'bg-cyan-700' : 'bg-cyan-200'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                    annual ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <span
                className={`text-sm font-semibold ${annual ? 'text-cyan-950' : 'text-cyan-600'}`}
              >
                Annual
                <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Save 17%
                </span>
              </span>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const price = annual ? plan.annual : plan.monthly
                return (
                  <div
                    key={plan.name}
                    className={`relative flex h-full flex-col rounded-2xl border p-6 ${
                      plan.highlight
                        ? 'card-shadow border-cyan-600 bg-gradient-to-b from-cyan-50/80 to-white ring-2 ring-cyan-600'
                        : 'card-shadow border-cyan-200/70 bg-white'
                    }`}
                  >
                    {plan.highlight ? (
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-cyan-700 px-3 py-1 text-xs font-semibold text-white">
                        <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        Most popular
                      </span>
                    ) : null}
                    <h3 className="text-lg font-bold text-cyan-950">{plan.name}</h3>
                    <p className="mt-1 text-sm text-cyan-700">{plan.tagline}</p>

                    <div className="mt-5 flex items-baseline gap-1.5">
                      {price === null ? (
                        <span className="text-3xl font-bold tracking-tight text-cyan-950">
                          Custom
                        </span>
                      ) : (
                        <>
                          <span className="tabular text-4xl font-bold tracking-tight text-cyan-950">
                            ${annual ? (price / 12).toFixed(0) : price}
                          </span>
                          <span className="text-sm font-medium text-cyan-600">/ month</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-cyan-600">
                      {price === null
                        ? 'Volume and site-based licensing'
                        : annual
                          ? `Billed $${plan.annual} annually`
                          : 'Billed monthly'}
                    </p>

                    <ul className="mt-6 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-cyan-800">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => navigate('/get-started')}
                      className={`mt-7 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-cyan-700 to-cyan-500 text-white shadow-sm hover:opacity-90'
                          : 'bg-white text-cyan-700 ring-1 ring-inset ring-cyan-300 hover:bg-cyan-50'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-cyan-100 bg-cyan-50/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <SectionHeading
                eyebrow="FAQ"
                title="Questions, answered"
                description="Everything you need to know before you get started. Still curious? Our team is a message away."
                align="left"
              />
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group card-shadow rounded-2xl border border-cyan-200/70 bg-white p-5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-cyan-950 marker:content-['']">
                      {faq.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 transition-transform duration-200 group-open:rotate-45">
                        <span className="relative block h-3.5 w-3.5">
                          <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded bg-current" />
                          <span className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 rounded bg-current" />
                        </span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-cyan-700">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="app-canvas border-t border-cyan-100">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-500 text-white shadow-lg shadow-cyan-900/25">
              <HeartPulse className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-cyan-950 sm:text-4xl">
              Ready to bring your care team together?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-cyan-800">
              Get started to create your account, or sign in to explore the dashboards and see how
              Medora fits your facility.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/get-started')}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-500 px-8 text-sm font-semibold text-white shadow-lg shadow-cyan-900/20 transition-all duration-200 hover:opacity-90"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-300 transition-colors duration-200 hover:bg-cyan-50"
              >
                Sign in
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#003D38] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <Brand onDark />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-cyan-200">
                A secure electronic health record platform connecting every care team on one shared
                source of truth.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  <Award className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                  ISO 27001 aligned
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  <Globe className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                  12 countries
                </span>
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: ['Platform', 'Integrations', 'Pricing', 'Security', 'Changelog'],
              },
              {
                title: 'Solutions',
                links: ['Doctors', 'Nursing', 'Laboratory', 'Pharmacy', 'Front desk'],
              },
              {
                title: 'Company',
                links: ['About us', 'Customers', 'Careers', 'Contact', 'Support'],
              },
            ].map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm text-cyan-200 transition-colors duration-200 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 border-t border-white/15 pt-8 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-cyan-200">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <a href="mailto:hello@medora.health" className="text-sm hover:text-white">
                hello@medora.health
              </a>
            </div>
            <p className="text-xs text-cyan-300">
              Secure • Compliant • Patient Centred
            </p>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-cyan-300 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Medora EHR. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#top" className="hover:text-white">
                Privacy
              </a>
              <a href="#top" className="hover:text-white">
                Terms
              </a>
              <a href="#top" className="hover:text-white">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
