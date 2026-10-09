import { CheckCircle2, FlaskConical, Timer, Upload } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, Card, CardHeader, MetricTile, PageHeader, StatusPill } from '../components/ui/primitives'
import { DataTable } from '../components/ui/Table'
import { BarChart, StackedSegments } from '../components/ui/Chart'
import {
  getPatientName,
  labStatusCounts,
  labTests,
  newLabReports,
  testsForBooking,
} from '../data/api'
import type { LabStatus } from '../data/types'

const statusTone: Record<LabStatus, 'normal' | 'abnormal' | 'critical'> = {
  booked: 'abnormal',
  'sample-collected': 'abnormal',
  processing: 'abnormal',
  completed: 'normal',
}

export function LaboratoryDashboard() {
  const [uploaded, setUploaded] = useState<string[]>([])

  const pendingUpload = labTests.filter((l) => l.status !== 'completed' && !l.reportUploaded)
  const actionable = [...pendingUpload, ...labTests.filter((l) => l.isNew && l.reportUploaded)]

  return (
    <>
      <PageHeader
        title="Laboratory dashboard"
        subtitle="Test throughput, report upload and the bookable catalogue."
        actions={
          <Button variant="primary">
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Total tests"
          value={labTests.length}
          hint="Ordered across all departments"
          icon={<FlaskConical className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="In progress"
          value={(labStatusCounts['sample-collected'] ?? 0) + (labStatusCounts.processing ?? 0)}
          hint="Sample collected or processing"
          severity="abnormal"
          icon={<Timer className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Completed"
          value={labStatusCounts.completed ?? 0}
          hint="Reports released to the EHR"
          icon={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricTile
          label="Awaiting upload"
          value={pendingUpload.length}
          hint="Results not yet attached"
          severity="critical"
          icon={<Upload className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Test analytics" description="Status mix across the lab" />
          <div className="p-5">
            <StackedSegments
              segments={[
                {
                  label: 'Completed',
                  value: labStatusCounts.completed ?? 0,
                  className: 'bg-emerald-600',
                },
                {
                  label: 'Processing',
                  value: labStatusCounts.processing ?? 0,
                  className: 'bg-cyan-500',
                },
                {
                  label: 'Sample collected',
                  value: labStatusCounts['sample-collected'] ?? 0,
                  className: 'bg-cyan-400',
                },
                { label: 'Booked', value: labStatusCounts.booked ?? 0, className: 'bg-cyan-200' },
              ]}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Report upload management"
            description="Attach results and release them to the doctor and patient views"
          />
          <DataTable
            caption="Laboratory tests and report upload status"
            rows={actionable}
            rowKey={(l) => l.id}
            emptyMessage="Nothing awaiting upload."
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
                key: 'patient',
                header: 'Patient',
                render: (l) => getPatientName(l.patientId),
              },
              {
                key: 'status',
                header: 'Status',
                render: (l) => <StatusPill severity={statusTone[l.status]}>{l.status}</StatusPill>,
              },
              {
                key: 'action',
                header: 'Action',
                align: 'right',
                render: (l) =>
                  uploaded.includes(l.id) ? (
                    <StatusPill severity="normal">Released</StatusPill>
                  ) : (
                    <Button onClick={() => setUploaded((prev) => [...prev, l.id])}>
                      Upload PDF
                    </Button>
                  ),
              },
            ]}
          />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Patient report history"
            description="Newly released results requiring attention"
          />
          <DataTable
            caption="Newly released lab reports"
            rows={newLabReports}
            rowKey={(l) => l.id}
            columns={[
              {
                key: 'patient',
                header: 'Patient',
                primary: true,
                render: (l) => getPatientName(l.patientId),
              },
              {
                key: 'test',
                header: 'Test',
                render: (l) => (
                  <span>
                    <span className="block">{l.testName}</span>
                    <span className="tabular text-cyan-700">GH₵ {l.price}</span>
                  </span>
                ),
              },
              {
                key: 'result',
                header: 'Result',
                render: (l) => <span className="text-cyan-800">{l.result}</span>,
              },
            ]}
          />
        </Card>

        <Card>
          <CardHeader
            title="Bookable test list"
            description="Catalogue exposed to the patient dashboard"
          />
          <DataTable
            caption="Available laboratory tests with pricing"
            rows={testsForBooking}
            rowKey={(t) => t.name}
            columns={[
              {
                key: 'name',
                header: 'Test',
                primary: true,
                render: (t) => (
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="text-cyan-700">{t.category}</span>
                  </span>
                ),
              },
              {
                key: 'price',
                header: 'Price',
                align: 'right',
                render: (t) => <span className="tabular">GH₵ {t.price}</span>,
              },
              {
                key: 'turnaround',
                header: 'Turnaround',
                align: 'right',
                render: (t) => <Badge>{t.turnaround}</Badge>,
              },
            ]}
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Tests ordered per category"
          description="Distribution of current laboratory workload"
        />
        <BarChart
          title="Laboratory tests ordered per category"
          data={[
            { label: 'Biochemistry', value: 3 },
            { label: 'Haematology', value: 2 },
            { label: 'Respiratory', value: 1 },
            { label: 'Renal', value: 1 },
            { label: 'Imaging', value: 1 },
            { label: 'Immunology', value: 1 },
            { label: 'Cardiac', value: 1 },
          ]}
        />
      </Card>
    </>
  )
}
