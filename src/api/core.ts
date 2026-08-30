import { request } from './http'
import type { AcademicStatus, DirectoryEntry, FinancialStatus, StudentProfile } from './types'

export const coreApi = {
  student: (ref: string) => request<StudentProfile>(`/api/core/students/${encodeURIComponent(ref)}`),
  academicStatus: (ref: string) =>
    request<AcademicStatus>(`/api/core/students/${encodeURIComponent(ref)}/academic-status`),
  financialStatus: (ref: string) =>
    request<FinancialStatus>(`/api/core/students/${encodeURIComponent(ref)}/financial-status`),

  /** Backs the support-network picker: professors and peers must be real SIS people, not free text. */
  searchDirectory: (query: string, kind: 'STUDENT' | 'PROFESSOR') =>
    request<DirectoryEntry[]>(
      `/api/core/directory/search?q=${encodeURIComponent(query)}&kind=${kind}`,
    ),
}
