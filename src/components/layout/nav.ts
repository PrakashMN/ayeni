import {
  Bell,
  ClipboardList,
  FlaskConical,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  description: string
  icon: LucideIcon
  role: string
}

export const navItems: NavItem[] = [
  {
    to: '/patient',
    label: 'Patient',
    description: 'Self-service care hub',
    icon: UserRound,
    role: 'Patient',
  },
  {
    to: '/doctor',
    label: 'Doctor',
    description: 'Cases, reports, task delegation',
    icon: Stethoscope,
    role: 'Clinician',
  },
  {
    to: '/staff',
    label: 'Staff',
    description: 'Assigned duties and vitals',
    icon: ClipboardList,
    role: 'Nursing',
  },
  {
    to: '/laboratory',
    label: 'Laboratory',
    description: 'Test analytics and reports',
    icon: FlaskConical,
    role: 'Diagnostics',
  },
  {
    to: '/pharmacy',
    label: 'Pharmacy',
    description: 'Inventory, orders, refills',
    icon: Pill,
    role: 'Pharmacy',
  },
  {
    to: '/reception',
    label: 'Reception',
    description: 'Front desk and billing',
    icon: Bell,
    role: 'Front desk',
  },
  {
    to: '/admin',
    label: 'Admin',
    description: 'Users, oversight, audit',
    icon: ShieldCheck,
    role: 'Administration',
  },
]
