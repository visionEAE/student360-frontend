# student360-frontend

Minimal React + Vite SPA for Student 360° (port **5173**). It talks only to the gateway
(`VITE_GATEWAY_URL`, default `http://localhost:8080`). The UI is evidence of the flow, not the
deliverable: plain CSS, four screens, no design library.

## Run

```bash
cp .env.example .env      # optional; defaults to the local gateway
npm install
npm run dev               # http://localhost:5173
npm test                  # vitest: single in-flight refresh, error surfacing
npm run build             # type-check + bundle
```

Demo accounts (password `student360`): `maria.rojas@u.icesi.edu.co` (student at risk, S-1003),
`ana.torres@u.icesi.edu.co` (student, S-1001), `carlos.mejia@icesi.edu.co` (advisor A-2001),
`diana.perez@icesi.edu.co` (advisor A-2002, not assigned to S-1003).

## Token handling (`src/auth/session.ts`, `src/api/http.ts`)

* **Access token in memory only** — a module-level store, never `localStorage`/`sessionStorage`,
  so an injected script finds no persisted credential.
* **Refresh token in the `HttpOnly; SameSite=Strict; Path=/api/auth` cookie** issued by the SSO;
  every request uses `credentials: 'include'` (SPA and gateway are both `localhost`, so the
  cookie is same-site).
* On load the app attempts one silent `POST /api/auth/refresh` to restore the session.
* On `401`: exactly **one** refresh attempt and **one** retry of the original request; if the
  refresh fails the state is cleared and the user is sent to login.
* **Single in-flight refresh**: concurrent `401`s share one refresh promise. Two parallel
  refreshes would present the same refresh token twice and the SSO would (correctly) read the
  second as reuse and revoke the whole session. Covered by `src/api/http.test.ts`.
* Every request carries a generated `X-Request-Id`; errors (RFC 7807) show it so it can be
  quoted and matched against the audit trail.

## Screens

| Route | Role | Content |
|---|---|---|
| `/login` | — | credentials form, role-based redirect |
| `/me` | `STUDENT` | 360° view: profile, academic status, financial status, engagement — each panel loads and fails on its own; a `503 {section: "engagement"}` from the gateway renders that panel as unavailable while the rest shows |
| `/wellbeing` | `STUDENT` | level 1–5 + optional comment; shows whether an alert was generated |
| `/inbox` | `ADVISOR`, `ADMIN` | alerts for actively assigned students |
| `/alerts/:id` | `ADVISOR`, `ADMIN` | triggering signals, suggested plan, reports, add-report form; `403` renders as "Not allowed" |
