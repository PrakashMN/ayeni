import {
  Activity,
  Bell,
  BellRing,
  CalendarClock,
  ChefHat,
  Droplet,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  Pill,
  Search,
  Sparkles,
  Stethoscope,
  Thermometer,
  TriangleAlert,
  Upload,
  UserRound,
  Weight,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, CardHeader, MetricTile, PageHeader, ProgressBar, StatusPill } from '../components/ui/primitives'
import { DataTable } from '../components/ui/Table'
import { BarChart } from '../components/ui/Chart'
import {
  currentPatient,
  currentPatientAppointments,
  currentPatientDiet,
  currentPatientGlucose,
  currentPatientLabs,
  currentPatientPrescriptions,
  latestVitals,
  notifications,
  testsForBooking,
} from '../data/api'
import type { Department, Severity } from '../data/types'
import { formatTime } from '../lib/format'

const vitalsLabels: Record<Severity, string> = {
  normal: 'Within range',
  abnormal: 'Borderline',
  critical: 'Needs attention',
}

const triageRules: { keywords: string[]; department: Department; note: string }[] = [
  {
    keywords: ['chest', 'heart', 'palpitation', 'blood pressure', 'hypertension'],
    department: 'Cardiology',
    note: 'Symptoms match a cardiovascular presentation. Book with a cardiologist.',
  },
  {
    keywords: ['fever', 'cough', 'breathless', 'wheeze', 'cold', 'asthma'],
    department: 'Pulmonology',
    note: 'Respiratory pattern detected. Consider a chest assessment within 24 hours.',
  },
  {
    keywords: ['rash', 'itch', 'skin', 'eczema', 'acne'],
    department: 'Dermatology',
    note: 'Skin presentation. Dermatology consult recommended, photo review advised.',
  },
  {
    keywords: ['headache', 'migraine', 'dizzy', 'seizure', 'numbness'],
    department: 'Neurology',
    note: 'Neurological features present. Avoid driving if episodes occur.',
  },
  {
    keywords: ['glucose', 'sugar', 'thirst', 'weight', 'thyroid', 'hormone'],
    department: 'Endocrinology',
    note: 'Metabolic symptoms detected. Fasting labs will be requested.',
  },
  {
    keywords: ['knee', 'back', 'joint', 'fracture', 'bone', 'spine'],
    department: 'Orthopaedics',
    note: 'Musculoskeletal complaint. Imaging may be required before review.',
  },
  {
    keywords: ['child', 'baby', 'toddler', 'infant'],
    department: 'Paediatrics',
    note: 'Paediatric presentation. Dosing is weight-based.',
  },
]

function analyseSymptoms(input: string) {
  const text = input.toLowerCase()
  return triageRules.filter((r) => r.keywords.some((k) => text.includes(k)))
}

export function PatientDashboard() {
  const [symptoms, setSymptoms] = useState('')
  const [analysed, setAnalysed] = useState(false)
  const [cancelledAppointments, setCancelledAppointments] = useState<string[]>([])
  const [orderedMedicines, setOrderedMedicines] = useState<string[]>([])
  const [bookedTests, setBookedTests] = useState<string[]>([])
  const [unreadOnly, setUnreadOnly] = useState(false)

  const vitals = latestVitals(currentPatient.id)
  const matches = analysed ? analyseSymptoms(symptoms) : []
  const visibleNotifications = unreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications

  const upcoming = currentPatientAppointments
    .filter((a) => a.status === 'confirmed' || a.status === 'pending')
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
  const completed = currentPatientAppointments.filter((a) => a.status === 'completed')

  const patientMedicines = currentPatientPrescriptions.flatMap((p) => p.medicines)
  const orderableMedicines = patientMedicines.filter((m) => !m.ordered).length

  const vitalRows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Gauge, label: 'Blood pressure', value: vitals ? vitals.bloodPressure : '—' },
    { icon: HeartPulse, label: 'Heart rate', value: vitals ? `${vitals.heartRate} bpm` : '—' },
    { icon: Activity, label: 'SpO₂', value: vitals ? `${vitals.spo2}%` : '—' },
    { icon: Thermometer, label: 'Temperature', value: vitals ? `${vitals.temperatureF} °F` : '—' },
    { icon: Weight, label: 'Weight', value: vitals ? `${vitals.weightKg} kg` : '—' },
  ]

  return (
    <>
      <PageHeader
        title={`Good morning, ${currentPatient.name.split(' ')[0]}`}
        subtitle="Your appointments, reports, prescriptions and care plan in one place."
        icon={<HeartPulse className="h-6 w-6" aria-hidden="true" />}
        actions={
          <>
            <Button>
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
              Book appointment
            </Button>
            <Button variant="primary">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload report
            </Button>
          </>
        }
      />

      <Card className="border-cyan-900/60 bg-gradient-to-br from-cyan-800 to-cyan-950 text-white">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-6 px-6 py-6 sm:px-8 sm:py-8 lg:gap-x-10">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-cyan-100 uppercase">
              <UserRound className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              Patient
            </p>
            <p className="mt-1.5 text-2xl font-bold text-white">{currentPatient.name}</p>
            <p className="tabular mt-0.5 text-sm text-cyan-100">
              {currentPatient.mrn} · {currentPatient.age} yrs · {currentPatient.sex}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-cyan-100 uppercase">
              <Droplet className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              Blood group
            </p>
            <p className="mt-1.5 text-2xl font-bold text-white">{currentPatient.bloodGroup}</p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-cyan-100 uppercase">
              <Activity className="h-5 w-5 text-cyan-200" aria-hidden="true" />
              Ongoing conditions
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {currentPatient.conditions.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-cyan-100 uppercase">
              <TriangleAlert className="h-5 w-5 text-red-300" aria-hidden="true" />
              Allergies
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {currentPatient.allergies.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-600/25 ring-inset"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Next appointment"
          value={upcoming[0] ? formatTime(upcoming[0].time) : '—'}
          hint={
            upcoming[0] ? `${upcoming[0].doctor} · ${upcoming[0].department}` : 'Book to get started'
          }
          icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Active prescriptions"
          value={currentPatientPrescriptions.length}
          hint={`${patientMedicines.length} medicines · ${orderableMedicines} to order`}
          icon={<Stethoscope className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="New reports"
          value={currentPatientLabs.filter((l) => l.isNew).length}
          hint="Awaiting your review"
          severity={currentPatientLabs.some((l) => l.isNew) ? 'abnormal' : 'normal'}
          icon={<FileText className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Unread reminders"
          value={notifications.filter((n) => !n.read).length}
          hint="Appointments, refills, results"
          severity={notifications.some((n) => !n.read) ? 'abnormal' : 'normal'}
          icon={<Bell className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Symptom analysis"
            description="Mirrors the triage logic used by the Medora WhatsApp bot."
            icon={<Activity className="h-5 w-5" aria-hidden="true" />}
          />
          <div className="p-5">
            <label htmlFor="symptoms" className="text-sm font-semibold text-cyan-900">
              Describe what you are feeling
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-cyan-500"
                  aria-hidden="true"
                />
                <input
                  id="symptoms"
                  type="text"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. chest tightness and high blood pressure since morning"
                  className="h-11 w-full rounded-xl border border-cyan-300 pr-3 pl-10 text-base text-cyan-900 placeholder:text-cyan-600"
                />
              </div>
              <Button variant="primary" onClick={() => setAnalysed(true)}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Analyse
              </Button>
            </div>

            {analysed ? (
              <div
                className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50/70 p-4"
                aria-live="polite"
              >
                {matches.length === 0 ? (
                  <p className="text-sm text-cyan-800">
                    No specific pattern matched. A general medicine consultation is the safest
                    starting point, or contact the WhatsApp bot for a nurse review.
                  </p>
                ) : (
                  <>
                    <p className="flex items-center gap-2 text-sm font-semibold text-cyan-900">
                      <Sparkles className="h-4 w-4 text-cyan-600" aria-hidden="true" />
                      Suggested pathway
                    </p>
                    <ul className="mt-3 space-y-2">
                      {matches.map((m) => (
                        <li
                          key={m.department}
                          className="flex flex-col gap-2 rounded-xl bg-white p-3 ring-1 ring-cyan-200 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                              <Stethoscope className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div>
                              <p className="font-semibold text-cyan-950">{m.department}</p>
                              <p className="text-sm text-cyan-700">{m.note}</p>
                            </div>
                          </div>
                          <Button className="shrink-0">Book {m.department}</Button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Latest vitals"
            description={`Recorded by ${vitals?.recordedBy ?? '—'}`}
            icon={<HeartPulse className="h-5 w-5" aria-hidden="true" />}
          />
          <ul className="divide-y divide-cyan-100 px-5">
            {vitalRows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center justify-between gap-3 py-3.5">
                <span className="flex items-center gap-3 text-sm text-cyan-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </span>
                <span className="tabular font-semibold text-cyan-950">{value}</span>
              </li>
            ))}
          </ul>
          {vitals ? (
            <div className="border-t border-cyan-100 px-5 py-3.5">
              <StatusPill severity={vitals.severity}>{vitalsLabels[vitals.severity]}</StatusPill>
            </div>
          ) : null}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="My appointments"
            description="Book, reschedule or cancel"
            icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
          />
          <DataTable
            caption="Your scheduled and past appointments"
            rows={currentPatientAppointments}
            rowKey={(a) => a.id}
            emptyMessage="No appointments yet."
            columns={[
              {
                key: 'date',
                header: 'Date & time',
                primary: true,
                render: (a) => (
                  <span>
                    <span className="block font-semibold">{a.date}</span>
                    <span className="tabular text-cyan-700">{a.time}</span>
                  </span>
                ),
              },
              {
                key: 'doctor',
                header: 'Doctor',
                render: (a) => (
                  <span>
                    <span className="block">{a.doctor}</span>
                    <span className="text-cyan-700">{a.department}</span>
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (a) => {
                  const isCancelled = cancelledAppointments.includes(a.id)
                  return isCancelled ? (
                    <StatusPill severity="critical">Cancelled</StatusPill>
                  ) : (
                    <Badge>{a.status}</Badge>
                  )
                },
              },
              {
                key: 'action',
                header: 'Action',
                align: 'right',
                render: (a) =>
                  a.status === 'completed' ? (
                    <span className="text-sm text-cyan-600">Closed</span>
                  ) : cancelledAppointments.includes(a.id) ? (
                    <span className="text-sm text-cyan-600">—</span>
                  ) : (
                    <span className="flex justify-end gap-2">
                      <Button
                        onClick={() =>
                          setCancelledAppointments((prev) =>
                            prev.includes(a.id) ? prev : [...prev, a.id],
                          )
                        }
                      >
                        Cancel
                      </Button>
                    </span>
                  ),
              },
            ]}
          />
          <p className="border-t border-cyan-100 px-5 py-3 text-xs text-cyan-700">
            {upcoming.length} upcoming · {completed.length} completed
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Report history"
            description="Diagnostics uploaded by the laboratory"
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
          />
          <DataTable
            caption="Your diagnostic reports"
            rows={currentPatientLabs}
            rowKey={(l) => l.id}
            columns={[
              {
                key: 'test',
                header: 'Test',
                primary: true,
                render: (l) => (
                  <span>
                    <span className="block font-semibold">{l.testName}</span>
                    <span className="text-cyan-700">{l.category}</span>
                  </span>
                ),
              },
              {
                key: 'result',
                header: 'Result',
                render: (l) =>
                  l.result ? (
                    <span className="text-cyan-800">{l.result}</span>
                  ) : (
                    <StatusPill severity="abnormal">{l.status}</StatusPill>
                  ),
              },
              {
                key: 'flag',
                header: 'New',
                render: (l) => (l.isNew ? <Badge tone="brand">New</Badge> : '—'),
              },
            ]}
          />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Prescriptions & medicine orders"
            description="One-click ordering with home delivery"
            icon={<Pill className="h-5 w-5" aria-hidden="true" />}
          />
          <ul className="divide-y divide-cyan-100">
            {currentPatientPrescriptions.flatMap((p) =>
              p.medicines.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors duration-200 hover:bg-cyan-50/60"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                      <Pill className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-cyan-950">{m.name}</p>
                      <p className="text-sm text-cyan-700">
                        {m.dosage} · {m.frequency} · {m.durationDays} days
                      </p>
                      <p className="text-xs text-cyan-600">Prescribed by {p.doctor}</p>
                    </div>
                  </div>
                  {orderedMedicines.includes(m.id) ? (
                    <StatusPill severity="normal">Order placed</StatusPill>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setOrderedMedicines((prev) => [...prev, m.id])}
                    >
                      Order now
                    </Button>
                  )}
                </li>
              )),
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Book a lab test"
            description="Live prices and turnaround times"
            icon={<FlaskConical className="h-5 w-5" aria-hidden="true" />}
          />
          <ul className="divide-y divide-cyan-100">
            {testsForBooking.slice(0, 5).map((t) => (
              <li
                key={t.name}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors duration-200 hover:bg-cyan-50/60"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-cyan-950">{t.name}</p>
                    <p className="text-sm text-cyan-700">
                      {t.category} · {t.turnaround}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular font-semibold text-cyan-900">GH₵ {t.price}</span>
                  {bookedTests.includes(t.name) ? (
                    <StatusPill severity="normal">Booked</StatusPill>
                  ) : (
                    <Button onClick={() => setBookedTests((prev) => [...prev, t.name])}>
                      Book slot
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Diet plan"
            description={currentPatientDiet.goal}
            icon={<ChefHat className="h-5 w-5" aria-hidden="true" />}
            action={
              <span className="text-sm font-semibold text-cyan-800">
                {currentPatientDiet.dailyCalories} kcal/day
              </span>
            }
          />
          <div className="p-5">
            <ul className="space-y-3">
              {currentPatientDiet.entries.map((e) => (
                <li
                  key={e.meal}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-cyan-900">{e.meal}</p>
                    <p className="text-sm text-cyan-700">{e.items}</p>
                  </div>
                  <span className="tabular text-sm font-medium text-cyan-900">
                    {e.calories} kcal
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {currentPatientDiet.restrictions.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-600/25 ring-inset"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Reminders & notifications"
            icon={<BellRing className="h-5 w-5" aria-hidden="true" />}
            action={
              <label className="flex cursor-pointer items-center gap-2 text-sm text-cyan-800">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-cyan-400 accent-cyan-700"
                />
                Unread only
              </label>
            }
          />
          <ul className="divide-y divide-cyan-100">
            {visibleNotifications.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-3 px-5 py-4 transition-colors duration-200 hover:bg-cyan-50/60"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                  <HeartPulse className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-cyan-950">{n.title}</p>
                  <p className="text-sm text-cyan-700">{n.body}</p>
                  <p className="tabular mt-1 text-xs text-cyan-700">
                    {new Date(n.at).toLocaleString()}
                  </p>
                </div>
                {n.read ? null : <StatusPill severity="abnormal">New</StatusPill>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Glucose trend"
          description="Fasting glucose readings across your last three visits"
          icon={<Activity className="h-5 w-5" aria-hidden="true" />}
        />
        <div className="p-4">
          <div className="overflow-hidden rounded-2xl border border-cyan-200/70 bg-cyan-50/70">
            <BarChart
              title="Fasting glucose in mg/dL over the last three visits"
              unit=""
              data={currentPatientGlucose.map((reading, index) => ({
                label: `Visit ${index + 1}`,
                value: reading.value,
              }))}
            />
            <div className="border-t border-cyan-200/70 px-5 py-4">
              <ProgressBar
                value={7.4}
                max={10}
                label="HbA1c against the 10% ceiling"
                severity="abnormal"
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
