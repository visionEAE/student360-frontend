import { request } from './http'

export interface AlertSummary {
  id: string
  studentId: string
  severity: string
  status: string
  generatedAt: string
  firedConditions: string[]
}

export interface AlertDetail {
  id: string
  studentId: string
  severity: string
  status: string
  source: string
  generatedAt: string
  triggeringSignals: {
    wellbeingLevel: number
    daysSinceLastAccess: number | null
    onTimeSubmissionRate: number | null
    coursesWithoutActivity: number | null
    overdueBalance: number | null
    daysOverdue: number | null
    financialHold: boolean | null
    firedConditions: string[]
    unavailableSources: string[]
  }
  interventionPlan: { id: string; type: string; description: string; status: string } | null
  reports: { id: string; advisorId: string; content: string; createdAt: string }[]
}

export const fetchInbox = () => request<AlertSummary[]>('/api/support/advisors/me/alerts')
export const fetchAlert = (id: string) => request<AlertDetail>(`/api/support/advisors/me/alerts/${id}`)
export const addReport = (id: string, content: string) =>
  request<{ id: string }>(`/api/support/advisors/me/alerts/${id}/reports`, { body: { content } })
