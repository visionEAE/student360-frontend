import { request } from './http'
import type { EngagementActivity, EngagementSignals } from './types'

export const lmsApi = {
  signals: (ref: string) => request<EngagementSignals>(`/api/lms/students/${encodeURIComponent(ref)}/signals`),
  activity: (ref: string, days = 30) =>
    request<EngagementActivity>(`/api/lms/students/${encodeURIComponent(ref)}/activity?days=${days}`),
}
