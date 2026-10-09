import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { AdminPanel } from './pages/AdminPanel'
import { DoctorDashboard } from './pages/DoctorDashboard'
import { LaboratoryDashboard } from './pages/LaboratoryDashboard'
import { PatientDashboard } from './pages/PatientDashboard'
import { PharmacyDashboard } from './pages/PharmacyDashboard'
import { ReceptionistDashboard } from './pages/ReceptionistDashboard'
import { StaffDashboard } from './pages/StaffDashboard'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/patient" replace />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/laboratory" element={<LaboratoryDashboard />} />
        <Route path="/pharmacy" element={<PharmacyDashboard />} />
        <Route path="/reception" element={<ReceptionistDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/patient" replace />} />
      </Routes>
    </AppShell>
  )
}
