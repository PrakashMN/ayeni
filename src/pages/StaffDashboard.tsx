import { Activity, ClipboardList, FileCheck2, PackageCheck, Undo2 } from 'lucide-react'
import { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  MetricTile,
  PageHeader,
  StatusPill,
  type Tone,
} from '../components/ui/primitives'
import { DataTable } from '../components/ui/Table'
import {
  draftDischarges,
  getPatientName,
  latestVitals,
  patients,
  patientInitials,
  tasks,
} from '../data/api'
import { formatDate, formatDay, humanize } from '../lib/format'
import type { Task, TaskStatus } from '../data/types'

const CURRENT_STAFF = 'Nurse Grace Owusu'

const statusTone: Record<TaskStatus, Tone> = {
  open: 'warning',
  'in-progress': 'brand',
  reverted: 'danger',
  done: 'positive',
}

export function StaffDashboard() {
  const [taskState, setTaskState] = useState<Record<string, TaskStatus>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.status])),
  )
  const [verified, setVerified] = useState<string[]>([])

  const myTasks = tasks.filter((t) => t.assignedTo === CURRENT_STAFF)
  const dueBeforeNoon = myTasks.filter((t) => new Date(t.due).getHours() < 12).length

  function update(task: Task, status: TaskStatus) {
    setTaskState((prev) => ({ ...prev, [task.id]: status }))
  }

  const openCount = Object.values(taskState).filter((s) => s === 'open' || s === 'in-progress').length
  const revertedCount = Object.values(taskState).filter((s) => s === 'reverted').length

  return (
    <>
      <PageHeader
        title="Staff dashboard"
        subtitle="Assigned duties, vitals capture and discharge summaries for your ward."
        icon={<ClipboardList className="h-6 w-6" aria-hidden="true" />}
        actions={
          <Button variant="primary">
            <Activity className="h-4 w-4" aria-hidden="true" />
            Record vitals
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Tasks assigned to me"
          value={myTasks.length}
          hint={`${dueBeforeNoon} due before noon`}
          icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Still open"
          value={openCount}
          hint="Across all staff"
          tone="warning"
          icon={<Activity className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Sent back for review"
          value={revertedCount}
          hint="Doctor feedback required"
          tone="danger"
          icon={<Undo2 className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Discharge summaries"
          value={draftDischarges.length}
          hint="Not yet doctor-approved"
          icon={<FileCheck2 className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <Card>
        <CardHeader
          title="My task queue"
          description="Complete a task to send an update back to the assigning doctor"
          icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
        />
        <ul className="divide-y divide-cyan-100">
          {myTasks.map((t) => {
            const status = taskState[t.id]
            return (
              <li
                key={t.id}
                className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar
                    initials={patientInitials(getPatientName(t.patientId))}
                    name={getPatientName(t.patientId)}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-cyan-950">{t.title}</p>
                    <p className="text-sm text-cyan-700">
                      {getPatientName(t.patientId)} · due {formatDay(t.due)}
                    </p>
                    <p className="text-xs text-cyan-700">
                      Assigned by {t.assignedBy} · {t.kind}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone={statusTone[status]}>{humanize(status)}</StatusPill>
                  {status === 'done' ? null : (
                    <>
                      <Button
                        onClick={() => update(t, 'in-progress')}
                        disabled={status === 'in-progress'}
                      >
                        Start
                      </Button>
                      <Button variant="primary" onClick={() => update(t, 'done')}>
                        Mark done
                      </Button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Vital updates"
            description="Recorded readings feed the doctor and patient dashboards instantly"
            icon={<Activity className="h-5 w-5" aria-hidden="true" />}
          />
          <DataTable
            caption="Vitals recorded across the ward"
            rows={patients}
            rowKey={(p) => p.id}
            columns={[
              {
                key: 'patient',
                header: 'Patient',
                primary: true,
                render: (p) => (
                  <span>
                    <span className="block font-semibold">{p.name}</span>
                    <span className="tabular text-cyan-700">{p.mrn}</span>
                  </span>
                ),
              },
              {
                key: 'entry',
                header: 'Entry',
                render: (p) => {
                  const record = latestVitals(p.id)
                  if (!record) return <span className="text-cyan-700">Not captured</span>
                  return (
                    <span className="tabular text-cyan-800">
                      {record.bloodPressure} · {record.spo2}% SpO₂
                    </span>
                  )
                },
              },
              {
                key: 'severity',
                header: 'Flag',
                render: (p) => {
                  const record = latestVitals(p.id)
                  return record ? (
                    <StatusPill severity={record.severity}>{record.severity}</StatusPill>
                  ) : (
                    <span className="text-cyan-700">—</span>
                  )
                },
              },
            ]}
          />
        </Card>

        <Card>
          <CardHeader
            title="Discharge summary management"
            description="Verify ward records before the doctor signs off"
            icon={<FileCheck2 className="h-5 w-5" aria-hidden="true" />}
          />
          <ul className="divide-y divide-cyan-100">
            {draftDischarges.map((d) => {
              const isVerified = verified.includes(d.id)
              return (
                <li key={d.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-cyan-950">
                        {getPatientName(d.patientId)}
                      </p>
                      <p className="text-sm text-cyan-700">{d.diagnosis}</p>
                      <p className="tabular mt-0.5 text-xs text-cyan-700">
                        Admitted {formatDate(d.admissionDate)} · discharge{' '}
                        {formatDate(d.dischargeDate)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {d.status === 'doctor-approved' ? (
                        <StatusPill tone="positive">Approved</StatusPill>
                      ) : isVerified ? (
                        <StatusPill tone="positive">Verified</StatusPill>
                      ) : (
                        <>
                          <Button>Edit</Button>
                          <Button
                            variant="primary"
                            onClick={() => setVerified((prev) => [...prev, d.id])}
                          >
                            Complete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Task feedback loop"
          description="Completed tasks revert to the doctor for verification and further action"
          icon={<PackageCheck className="h-5 w-5" aria-hidden="true" />}
        />
        <DataTable
          caption="Task feedback status"
          rows={tasks}
          rowKey={(t) => t.id}
          columns={[
            {
              key: 'task',
              header: 'Task',
              primary: true,
              render: (t) => (
                <span>
                  <span className="block font-semibold">{t.title}</span>
                  <span className="text-cyan-700">{getPatientName(t.patientId)}</span>
                </span>
              ),
            },
            {
              key: 'assignee',
              header: 'Assigned to',
              render: (t) => t.assignedTo,
            },
            {
              key: 'status',
              header: 'Status',
              render: (t) => {
                const status = taskState[t.id]
                return <StatusPill tone={statusTone[status]}>{humanize(status)}</StatusPill>
              },
            },
            {
              key: 'action',
              header: 'Action',
              align: 'right',
              render: (t) =>
                taskState[t.id] === 'reverted' ? (
                  <Button>Reopen</Button>
                ) : (
                  <span className="text-sm text-cyan-700">—</span>
                ),
            },
          ]}
        />
        <p className="flex items-center gap-2 border-t border-cyan-100 px-5 py-3 text-xs text-cyan-700">
          <PackageCheck className="h-4 w-4" aria-hidden="true" />
          Medicine deliveries confirm back to the pharmacy dashboard once received at the ward.
        </p>
      </Card>
    </>
  )
}

