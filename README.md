# Medora EHR

Unified electronic health record connecting patients, doctors, staff, laboratories,
pharmacy, reception and administration through a single interface. Each stakeholder has a
purpose-built dashboard over one shared patient record.

Frontend prototype. All records are synthetic and live in memory.

## Stack

| Concern    | Choice                        |
| ---------- | ----------------------------- |
| Build      | Vite 8                        |
| UI         | React 19 + TypeScript 6       |
| Styling    | Tailwind CSS 4 (CSS-first)    |
| Routing    | React Router 7                |
| Icons      | lucide-react                  |
| Lint       | ESLint 10                     |

## Getting started

```bash
npm install
npm run dev
```

| Script          | Purpose                        |
| --------------- | ------------------------------ |
| `npm run dev`   | Start the dev server           |
| `npm run build` | Typecheck, then build for prod |
| `npm run lint`  | ESLint over the project        |
| `npm run typecheck` | `tsc -b` without emitting   |

## The seven dashboards

| Route         | Dashboard | Covers                                                              |
| ------------- | --------- | ------------------------------------------------------------------- |
| `/patient`    | Patient   | Symptom triage, appointments, reports, lab booking, prescriptions, notifications, diet plan |
| `/doctor`     | Doctor    | Patient list, problem summaries, report review, task delegation, sign-off |
| `/staff`      | Staff     | Task queue, vitals capture, discharge summaries, feedback loop       |
| `/laboratory` | Laboratory | Test analytics, report uploads, patient history, bookable catalogue |
| `/pharmacy`   | Pharmacy  | Inventory, prescription fulfilment, orders, refills                  |
| `/reception`  | Reception | Patient flow, appointment approval, billing, discharge coordination  |
| `/admin`      | Admin     | User roles, data oversight, system config, security audit log        |

## Layout

```
src/
  data/
    types.ts   Domain model
    mock.ts    Synthetic records
    api.ts     Data-access seam — swap this for a real API
  components/
    layout/    AppShell, navigation config
    ui/        Primitives: Card, Button, Badge, Table, charts
  pages/       One file per dashboard
```

Every page reads through `src/data/api.ts` rather than importing `mock.ts` directly, so
replacing the mock with HTTP calls is a single-file change.

## Design and accessibility

Built to WCAG AAA-oriented targets: 4.5:1 minimum text contrast, 3px focus rings, 44px
minimum touch targets, a skip link to main content, and `prefers-reduced-motion` respected.

- Cyan and emerald palette, tuned for clinical contexts rather than decoration
- Status is never colour-only — every severity pill carries a text label
- Clinical tables switch to a stacked card layout below 768px
- Verified at 375px, 768px, 1024px and 1440px

## Notes

- Currency is formatted in GH₵ throughout
- Dates are generated relative to the current date, so the demo never looks stale
- No authentication yet; the shell renders all seven dashboards behind a role label
