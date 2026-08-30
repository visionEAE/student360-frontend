import { request } from './http'
import type {
  AdvisorStudentsOverview,
  AlertDetail,
  AlertStatus,
  AlertSummary,
  InterventionPlan,
  PlanStatus,
  PlanType,
  RequestStatus,
  RequestType,
  Severity,
  StudentCase,
  SupportReport,
  SupportRequest,
  WellbeingDraft,
  WellbeingEntryRequest,
  WellbeingEntryResult,
  WellbeingSummary,
} from './types'

const students = (ref: string) => `/api/support/students/${encodeURIComponent(ref)}`
const me = '/api/support/advisors/me'

export const supportApi = {
  // ----- student side -----
  wellbeingSummary: (ref: string) => request<WellbeingSummary>(`${students(ref)}/wellbeing-summary`),
  wellbeingDraft: (ref: string) => request<WellbeingDraft | undefined>(`${students(ref)}/wellbeing-entries/draft`),
  createWellbeingEntry: (ref: string, body: WellbeingEntryRequest) =>
    request<WellbeingEntryResult>(`${students(ref)}/wellbeing-entries`, { body }),
  updateWellbeingEntry: (ref: string, entryId: string, body: WellbeingEntryRequest) =>
    request<WellbeingEntryResult>(`${students(ref)}/wellbeing-entries/${entryId}`, { method: 'PUT', body }),

  // ----- advisor side: queries -----
  studentsOverview: () => request<AdvisorStudentsOverview>(`${me}/students`),
  studentCase: (ref: string) => request<StudentCase>(`${me}/students/${encodeURIComponent(ref)}`),
  alerts: () => request<AlertSummary[]>(`${me}/alerts`),
  alert: (id: string) => request<AlertDetail>(`${me}/alerts/${id}`),
  interventionPlans: () => request<InterventionPlan[]>(`${me}/intervention-plans`),
  reports: () => request<SupportReport[]>(`${me}/reports`),
  requests: () => request<SupportRequest[]>(`${me}/requests`),
  studentRequests: (ref: string) => request<SupportRequest[]>(`${me}/students/${encodeURIComponent(ref)}/requests`),

  // ----- advisor side: commands -----
  addReport: (alertId: string, content: string) =>
    request<{ id: string; alertId: string }>(`${me}/alerts/${alertId}/reports`, { body: { content } }),
  updateAlertStatus: (alertId: string, status: AlertStatus) =>
    request<void>(`${me}/alerts/${alertId}`, { method: 'PATCH', body: { status } }),
  createManualAlert: (ref: string, severity: Severity, reason: string) =>
    request<{ alertId: string }>(`${me}/students/${encodeURIComponent(ref)}/alerts`, { body: { severity, reason } }),
  createInterventionPlan: (ref: string, type: PlanType, description: string, alertId?: string | null) =>
    request<{ planId: string }>(`${me}/students/${encodeURIComponent(ref)}/intervention-plans`, {
      body: { type, description, alertId: alertId ?? undefined },
    }),
  updateInterventionPlanStatus: (planId: string, status: PlanStatus) =>
    request<void>(`${me}/intervention-plans/${planId}`, { method: 'PATCH', body: { status } }),
  createRequest: (ref: string, type: RequestType, description: string, alertId?: string | null) =>
    request<{ requestId: string }>(`${me}/students/${encodeURIComponent(ref)}/requests`, {
      body: { type, description, alertId: alertId ?? undefined },
    }),
  updateRequestStatus: (requestId: string, status: RequestStatus, resolution?: string) =>
    request<void>(`${me}/requests/${requestId}`, { method: 'PATCH', body: { status, resolution } }),
}
