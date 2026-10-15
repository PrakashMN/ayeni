import { Navigate, Outlet, Route, Routes } from 'react-router'
import { AppShell } from './components/layout/AppShell'
import { AdminPanel } from './pages/AdminPanel'
import { DoctorDashboard } from './pages/DoctorDashboard'
import { GetStarted } from './pages/GetStarted'
import { LaboratoryDashboard } from './pages/LaboratoryDashboard'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { PatientDashboard } from './pages/PatientDashboard'
import { PharmacyDashboard } from './pages/PharmacyDashboard'
import { ReceptionistDashboard } from './pages/ReceptionistDashboard'
import { SignUp } from './pages/SignUp'
import { StaffDashboard } from './pages/StaffDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        element={
          <AppShell>
            <Outlet />
          </AppShell>
        }
      >
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/laboratory" element={<LaboratoryDashboard />} />
        <Route path="/pharmacy" element={<PharmacyDashboard />} />
        <Route path="/reception" element={<ReceptionistDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
