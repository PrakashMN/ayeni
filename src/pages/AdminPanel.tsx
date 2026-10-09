import { Building2, ScrollText, ShieldAlert, UserCog } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Badge, Button, Card, CardHeader, MetricTile, PageHeader, ProgressBar, StatusPill } from '../components/ui/primitives'
import { DataTable } from '../components/ui/Table'
import { BarChart } from '../components/ui/Chart'
import {
  appointments,
  auditEvents,
  getPatientName,
  labTests,
  patients,
  prescriptions,
  recordVolume,
  revenueCollected,
  revenueOutstanding,
  userRoleCounts,
  users,
} from '../data/api'
import type { User } from '../data/types'

const roleTone: Record<string, 'normal' | 'abnormal' | 'critical'> = {
  active: 'normal',
  invited: 'abnormal',
  suspended: 'critical',
}

export function AdminPanel() {
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all')
  const [saved, setSaved] = useState<string[]>([])

  const filteredUsers = users.filter((u) => roleFilter === 'all' || u.role === roleFilter)

  function toggleAccess(user: User) {
    setSaved((prev) => (prev.includes(user.id) ? prev : [...prev, user.id]))
  }

  return (
    <>
      <PageHeader
        title="Admin panel"
        subtitle="User access, system configuration and the security audit trail."
        actions={
          <Button variant="primary">
            <UserCog className="h-4 w-4" aria-hidden="true" />
            Add user
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Platform users"
          value={users.length}
          hint={`${users.filter((u) => u.status === 'active').length} active now`}
          icon={<UserCog className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Patients on record"
          value={patients.length}
          hint="All departments combined"
          icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Revenue collected"
          value={`GH₵ ${revenueCollected.toLocaleString()}`}
          hint={`GH₵ ${revenueOutstanding.toLocaleString()} outstanding`}
          severity="abnormal"
          icon={<ScrollText className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Security events"
          value={auditEvents.filter((a) => a.severity !== 'normal').length}
          hint="Require review"
          severity="critical"
          icon={<ShieldAlert className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <Card>
        <CardHeader
          title="User role management"
          description="Grant, edit or revoke access for every staff group"
        />
        <div className="flex flex-wrap items-center gap-2 border-b border-cyan-100 p-5">
          <span className="text-sm font-semibold text-cyan-900">Filter by role</span>
          {(['all', 'doctor', 'staff', 'lab', 'pharmacy', 'receptionist', 'admin'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              aria-pressed={roleFilter === r}
              className={`min-h-11 cursor-pointer rounded-lg px-3 text-sm font-medium capitalize transition-colors duration-200 ${
                roleFilter === r
                  ? 'bg-cyan-700 text-white'
                  : 'bg-white text-cyan-800 ring-1 ring-cyan-300 ring-inset hover:bg-cyan-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <DataTable
          caption="Platform users with role and access status"
          rows={filteredUsers}
          rowKey={(u) => u.id}
          emptyMessage="No users with this role."
          columns={[
            {
              key: 'user',
              header: 'User',
              primary: true,
              render: (u) => (
                <span className="flex items-center gap-3">
                  <Avatar initials={initialsOf(u.name)} name={u.name} size="sm" />
                  <span>
                    <span className="block font-semibold">{u.name}</span>
                    <span className="text-cyan-700">{u.email}</span>
                  </span>
                </span>
              ),
            },
            {
              key: 'role',
              header: 'Role',
              render: (u) => <Badge>{u.role}</Badge>,
            },
            {
              key: 'lastActive',
              header: 'Last active',
              render: (u) => (
                <span className="tabular text-cyan-800">
                  {new Date(u.lastActive).toLocaleString()}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Access',
              render: (u) => (
                <StatusPill severity={roleTone[u.status] ?? 'normal'}>{u.status}</StatusPill>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              align: 'right',
              render: (u) =>
                saved.includes(u.id) ? (
                  <StatusPill severity="normal">Updated</StatusPill>
                ) : (
                  <Button onClick={() => toggleAccess(u)}>Edit access</Button>
                ),
            },
          ]}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Security & audit logs"
            description="Every privileged action across the platform"
          />
          <ul className="divide-y divide-cyan-100">
            {auditEvents.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <StatusPill severity={a.severity}>{a.severity}</StatusPill>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-cyan-950">{a.action}</p>
                  <p className="text-sm text-cyan-700">{a.target}</p>
                  <p className="tabular mt-0.5 text-xs text-cyan-500">
                    {a.actor} · {a.role} · {new Date(a.at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Users by role" description="Access distribution" />
            <div className="space-y-4 p-5">
              {Object.entries(userRoleCounts).map(([role, count]) => (
                <ProgressBar
                  key={role}
                  value={count}
                  max={users.length}
                  label={role}
                  severity={role === 'admin' ? 'abnormal' : 'normal'}
                />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="System configuration"
              description="Departments, services and internal workflows"
            />
            <ul className="divide-y divide-cyan-100">
              {[
                { label: 'Clinical departments', value: '8 configured' },
                { label: 'Dashboard modules', value: '7 published' },
                { label: 'WhatsApp bot integration', value: 'Connected' },
                { label: 'Medora app sync', value: 'Live' },
                { label: 'Audit retention', value: '7 years' },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <span className="text-sm text-cyan-800">{row.label}</span>
                  <span className="text-sm font-semibold text-cyan-950">{row.value}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Data oversight — appointments"
            description="Booking source mix across the platform"
          />
          <DataTable
            caption="Appointments by booking source"
            rows={['app', 'whatsapp', 'walk-in'].map((source) => ({
              source,
              count: appointments.filter((a) => a.source === source).length,
            }))}
            rowKey={(r) => r.source}
            columns={[
              {
                key: 'source',
                header: 'Source',
                primary: true,
                render: (r) => <span className="capitalize">{r.source}</span>,
              },
              {
                key: 'count',
                header: 'Appointments',
                align: 'right',
                render: (r) => <span className="tabular">{r.count}</span>,
              },
            ]}
          />
        </Card>

        <Card>
          <CardHeader
            title="Volume trend"
            description="Clinical records created over the last seven days"
          />
          <BarChart
            title="Clinical records created per day over the last seven days"
            data={recordVolume}
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Cross-module record counts"
          description="Every module writes into the same patient record"
        />
        <DataTable
          caption="Record counts per module"
          rows={[
            { module: 'Appointments', count: appointments.length, owner: 'Reception' },
            { module: 'Patients', count: patients.length, owner: 'Registration' },
            { module: 'Laboratory tests', count: labTests.length, owner: 'Laboratory' },
            { module: 'Prescriptions', count: prescriptions.length, owner: 'Doctors' },
          ]}
          rowKey={(r) => r.module}
          columns={[
            { key: 'module', header: 'Module', primary: true, render: (r) => r.module },
            {
              key: 'owner',
              header: 'Owner',
              render: (r) => r.owner,
            },
            {
              key: 'count',
              header: 'Records',
              align: 'right',
              render: (r) => <span className="tabular">{r.count}</span>,
            },
            {
              key: 'sample',
              header: 'Sample',
              render: (r) => (r.module === 'Patients' ? getPatientName(patients[0].id) : '—'),
            },
          ]}
        />
      </Card>
    </>
  )
}

function initialsOf(name: string): string {
  return name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
