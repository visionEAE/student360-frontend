import { request } from './http'
import type { AcademicStatus, FinancialStatus, StudentProfile } from './types'

export const coreApi = {
  student: (ref: string) => request<StudentProfile>(`/api/core/students/${encodeURIComponent(ref)}`),
  academicStatus: (ref: string) =>
    request<AcademicStatus>(`/api/core/students/${encodeURIComponent(ref)}/academic-status`),
  financialStatus: (ref: string) =>
    request<FinancialStatus>(`/api/core/students/${encodeURIComponent(ref)}/financial-status`),
}
