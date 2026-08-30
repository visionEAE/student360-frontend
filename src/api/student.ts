import { request } from './http'

export interface StudentProfile {
  id: string
  fullName: string
  email: string
  program: { code: string; name: string; faculty: string }
  admissionTerm: string
  status: string
}

export interface AcademicStatus {
  studentId: string
  currentTerm: string
  academicStanding: string
  cumulativeGpa: number
  creditsEnrolled: number
  history: {
    term: string
    creditsEnrolled: number
    creditsApproved: number
    termGpa: number | null
    cumulativeGpa: number
    academicStanding: string
  }[]
}

export interface FinancialStatus {
  studentId: string
  outstandingBalance: number
  overdueBalance: number
  daysOverdue: number
  overdue: boolean
  paymentPlan: boolean
  financialHold: boolean
  updatedAt: string
}

export interface EngagementSignals {
  studentId: string
  computedAt: string
  daysSinceLastAccess: number | null
  onTimeSubmissionRate: number | null
  coursesWithoutActivity: number
  activeCourses: number
  lateSubmissions: number
  missingSubmissions: number
}

export interface WellbeingEntryResult {
  studentId: string
  level: number
  alertGenerated: boolean
  alertId: string | null
}

export const fetchStudent = (ref: string) => request<StudentProfile>(`/api/core/students/${ref}`)
export const fetchAcademicStatus = (ref: string) =>
  request<AcademicStatus>(`/api/core/students/${ref}/academic-status`)
export const fetchFinancialStatus = (ref: string) =>
  request<FinancialStatus>(`/api/core/students/${ref}/financial-status`)
export const fetchEngagementSignals = (ref: string) =>
  request<EngagementSignals>(`/api/lms/students/${ref}/signals`)
export const recordWellbeingEntry = (ref: string, level: number, comment: string) =>
  request<WellbeingEntryResult>(`/api/support/students/${ref}/wellbeing-entries`, {
    body: { level, comment: comment.trim() === '' ? undefined : comment },
  })
