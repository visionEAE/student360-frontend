# student360-frontend

Minimal React + Vite SPA for Student 360°, built to `pen_design/vision360.pen` on an **atomic
design** component system (`atoms → molecules → organisms → templates → pages`) and coded against
`student360-infra/docs/api-contract-v2.md`, through the gateway only (`VITE_GATEWAY_URL`, default
`http://localhost:8080`).

## Component system

```
src/design/         tokens.css (colours, type, radii, spacing — 1:1 with the .pen variables), global.css
src/components/
  atoms/             Text, Button, Badge, Avatar, Icon, Input, Checkbox, Chip, MoodPill, ProgressBar, Spinner, Divider
  molecules/         NavItem, StatTile, KeyValueList, CardHeader, SignalRow, WellbeingEntryRow, StudentCell,
                      StatusBadge/RiskBadge, FilterPill, BarChart, DataTable, FormField, Error/Empty/UnavailablePanel
  organisms/         Sidebar, Topbar, StudentHeader, ActiveAlertCard, InterventionPlanCard, WellbeingTimelineCard,
                      Academic/Financial/Engagement/WellbeingSection, StudentsTable, SummaryChips,
                      SafeSpaceBanner/Footer, DimensionCard, LoginForm, BrandPanel
  templates/         AuthLayout, AppShell, TwoColumnLayout, StackLayout
src/pages/           one file per route (below)
src/lib/             format.ts, labels.ts, signals.ts (alert sentence builder), students.ts (table logic),
                     wellbeing.ts (safe-space form logic) — all pure and unit-tested
src/api/             http.ts (token handling) + typed core.ts / lms.ts / support.ts / auth.ts
```

No UI kit: plain CSS Modules on the design tokens, `lucide-react` for icons, Plus Jakarta Sans from
Google Fonts.

## Routes

| Path | Screen | Role |
|---|---|---|
| `/login` | Login | public |
| `/advisor/students` | "Mis estudiantes" — overview table, risk chips, filters | ADVISOR/ADMIN |
| `/advisor/students/:id` | "Advisor - Student 360 View" — alert, plan, wellbeing timeline + side cards | ADVISOR/ADMIN |
| `/advisor/students/:id/profile` | Full "Student Information Display" (four sections) | ADVISOR/ADMIN |
| `/advisor/alerts`, `/advisor/alerts/:id` | Alert inbox and detail with reports | ADVISOR/ADMIN |
| `/advisor/interventions` | Intervention plans, accept/complete | ADVISOR/ADMIN |
| `/advisor/reports` | Support reports across students | ADVISOR/ADMIN |
| `/me/overview` | The student's own Student Information Display — **the minimum requirement**: personal, academic, financial data and campus activity in one place | STUDENT |
| `/me/safe-space` | "Mi espacio seguro" — three dimension cards, draft save/restore, send | STUDENT |
| `/me/support-network` | "Mi red de apoyo" — interactive weighted graph, edit/create connections | STUDENT |

The support network also appears as a section on `/advisor/students/:id`, read from
`network-service` and editable by the advisor (a `SUPPORT_TEAM`-tagged edge, independent of the
student's own `SELF` edge on the same person).

## Support network graph

`SupportNetworkGraph` renders `network-service`'s weighted `SUPPORTS` graph as an interactive
force-directed diagram: **d3-force** computes the layout (link/charge/collision forces), **d3-drag**
makes nodes draggable, **d3-zoom** handles pan/zoom — all three are focused d3 submodules (not the
full `d3` bundle), rendered as plain SVG so the graph stays themeable with the app's own CSS
tokens instead of a canvas/WebGL library's own styling model. `src/lib/networkGraph.ts` is the
pure, unit-tested function that turns a `SupportNetworkView` into `{nodes, links}`: a person rated
by both the student (`SELF`) and the support team (`SUPPORT_TEAM`) becomes two parallel, offset
lines rather than one merged number. Editing is scoped to the viewer's own edge; the other
rater's edge on the same person is always shown, never overwritten.

## Data and auth

Unchanged from the previous version: the access token lives in a module-level variable only
(never `localStorage`/`sessionStorage`); the refresh token is an `HttpOnly` cookie; `src/api/http.ts`
retries a `401` at most once and shares **one in-flight refresh promise** across concurrent
requests, so two panels failing at once never trigger SSO reuse detection. Every card that reads
its own source (`useLoad`) degrades independently: a `503 {section}` from the gateway renders
`UnavailablePanel`, not a broken page.

## Run

```bash
npm install
npm run dev     # http://localhost:5173, needs the gateway on :8080
```

## Verify

```
npm run build   # tsc -b && vite build
npm test        # vitest --run — format/labels/signals/students/wellbeing logic + the http single-flight refresh
npm run lint    # oxlint
```
