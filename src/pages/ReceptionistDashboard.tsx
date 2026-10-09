import { Banknote, CheckCircle2, DoorOpen, Printer, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Button, Card, CardHeader, MetricTile, PageHeader, StatusPill } from '../components/ui/primitives'
import { DataTable } from '../components/ui/Table'
import {
  appointments,
  appointmentsFor,
  draftDischarges,
  getPatientName,
  invoices,
  patientInitials,
  pendingAppointments,
  todayKey,
} from '../data/api'
import type { Appointment } from '../data/types'

function minutesOf(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function ReceptionistDashboard() {
  const [confirmed, setConfirmed] = useState<string[]>([])
  const [paid, setPaid] = useState<string[]>([])
  const [printed, setPrinted] = useState<string[]>([])

  const today = appointmentsFor()
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  function isConfirmed(a: Appointment) {
    return a.status === 'confirmed' || confirmed.includes(a.id)
  }

  const flowStages = [
    { label: 'Arriving', count: 0, className: 'bg-cyan-200' },
    { label: 'Waiting', count: 0, className: 'bg-cyan-400' },
    { label: 'In consultation', count: 0, className: 'bg-cyan-600' },
    { label: 'Completed', count: 0, className: 'bg-emerald-600' },
  ]
  for (const a of today) {
    if (a.status === 'completed') flowStages[3].count++
    else if (!isConfirmed(a)) flowStages[0].count++
    else if (minutesOf(a.time) <= nowMinutes) flowStages[2].count++
    else flowStages[1].count++
  }

  const collected = invoices
    .filter((i) => i.status === 'paid' || paid.includes(i.id))
    .reduce((sum, i) => sum + i.amount, 0)
  const openInvoices = invoices.filter((i) => i.status !== 'paid' && !paid.includes(i.id))
  const outstanding = openInvoices.reduce((sum, i) => sum + i.amount, 0)

  return (
    <>
      <PageHeader
        title="Reception dashboard"
        subtitle="Front desk flow, appointment approvals and billing."
        actions={
          <Button variant="primary">
            <UserCheck className="h-4 w-4" aria-hidden="true" />
            Register walk-in
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Appointments today"
          value={today.length}
          hint={`${pendingAppointments.length} awaiting approval`}
          severity={pendingAppointments.length > 0 ? 'abnormal' : 'normal'}
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Collected"
          value={`GH₵ ${collected.toLocaleString()}`}
          hint="Settled invoices"
          icon={<Banknote className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Outstanding"
          value={`GH₵ ${outstanding.toLocaleString()}`}
          hint={`${openInvoices.length} unpaid invoices`}
          severity="critical"
          icon={<Banknote className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Discharge coordination"
          value={draftDischarges.length}
          hint="Summaries to verify"
          severity="abnormal"
          icon={<DoorOpen className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <Card>
        <CardHeader
          title="Patient flow overview"
          description="Live view of where every patient is right now"
        />
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          {flowStages.map((s) => (
            <div key={s.label} className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.className}`} aria-hidden="true" />
                <p className="text-sm font-medium text-cyan-800">{s.label}</p>
              </div>
              <p className="tabular mt-1.5 text-2xl font-bold text-cyan-950">{s.count}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Appointment confirmation"
          description="Requests raised through the app, WhatsApp bot and walk-in desk"
        />
        <DataTable
          caption="Appointment requests awaiting front desk confirmation"
          rows={appointments.filter((a) => a.date >= todayKey())}
          rowKey={(a) => a.id}
          columns={[
            {
              key: 'patient',
              header: 'Patient',
              primary: true,
              render: (a) => (
                <span className="flex items-center gap-3">
                  <Avatar
                    initials={patientInitials(getPatientName(a.patientId))}
                    name={getPatientName(a.patientId)}
                    size="sm"
                  />
                  <span>
                    <span className="block font-semibold">
                      {getPatientName(a.patientId)}
                    </span>
                    <span className="text-cyan-700">{a.reason}</span>
                  </span>
                </span>
              ),
            },
            {
              key: 'when',
              header: 'When',
              render: (a) => (
                <span className="tabular">
                  <span className="block">{a.date}</span>
                  <span className="text-cyan-700">{a.time}</span>
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
              key: 'source',
              header: 'Source',
              render: (a) => <span className="capitalize">{a.source}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (a) =>
                a.status === 'completed' ? (
                  <StatusPill severity="normal">Completed</StatusPill>
                ) : isConfirmed(a) ? (
                  <StatusPill severity="normal">Confirmed</StatusPill>
                ) : (
                  <StatusPill severity="abnormal">Pending</StatusPill>
                ),
            },
            {
              key: 'action',
              header: 'Action',
              align: 'right',
              render: (a) =>
                a.status === 'completed' || isConfirmed(a) ? (
                  <span className="text-sm text-cyan-600">—</span>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setConfirmed((prev) => [...prev, a.id])}
                  >
                    Approve
                  </Button>
                ),
            },
          ]}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Billing management"
            description="Payments, confirmations and invoice generation"
          />
          <DataTable
            caption="Patient invoices and payment status"
            rows={invoices}
            rowKey={(i) => i.id}
            columns={[
              {
                key: 'invoice',
                header: 'Invoice',
                primary: true,
                render: (i) => (
                  <span>
                    <span className="tabular block font-semibold">{i.id}</span>
                    <span className="text-cyan-700">{getPatientName(i.patientId)}</span>
                  </span>
                ),
              },
              {
                key: 'amount',
                header: 'Amount',
                align: 'right',
                render: (i) => <span className="tabular">GH₵ {i.amount}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (i) => {
                  if (paid.includes(i.id)) return <StatusPill severity="normal">Paid</StatusPill>
                  if (i.status === 'paid') return <StatusPill severity="normal">Paid</StatusPill>
                  if (i.status === 'partial') return <StatusPill severity="abnormal">Partial</StatusPill>
                  return <StatusPill severity="critical">Unpaid</StatusPill>
                },
              },
              {
                key: 'action',
                header: 'Action',
                align: 'right',
                render: (i) =>
                  i.status === 'paid' || paid.includes(i.id) ? (
                    <Button onClick={() => setPrinted((prev) => [...prev, i.id])}>
                      <Printer className="h-4 w-4" aria-hidden="true" />
                      Print
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => setPaid((prev) => [...prev, i.id])}>
                      Mark paid
                    </Button>
                  ),
              },
            ]}
          />
        </Card>

        <Card>
          <CardHeader
            title="Discharge summary coordination"
            description="Verified with staff, awaiting doctor sign-off"
          />
          <ul className="divide-y divide-cyan-100">
            {draftDischarges.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-cyan-950">{getPatientName(d.patientId)}</p>
                  <p className="text-sm text-cyan-700">{d.diagnosis}</p>
                  <p className="tabular text-xs text-cyan-600">
                    Discharge {d.dischargeDate} · {d.completedBy}
                  </p>
                </div>
                {d.status === 'doctor-approved' ? (
                  <StatusPill severity="normal">Complete</StatusPill>
                ) : d.status === 'staff-verified' ? (
                  <StatusPill severity="abnormal">Awaiting doctor</StatusPill>
                ) : (
                  <StatusPill severity="critical">Draft</StatusPill>
                )}
              </li>
            ))}
          </ul>
          {printed.length > 0 ? (
            <p className="border-t border-cyan-100 px-5 py-3 text-xs text-cyan-700">
              {printed.length} invoice(s) printed this session.
            </p>
          ) : null}
        </Card>
      </div>
    </>
  )
}
