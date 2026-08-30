import { request } from './http'
import type {
  ConnectionDetail,
  SupportNetworkView,
  UpsertConnectionRequest,
  UpsertConnectionResult,
} from './types'

const studentPath = (ref: string) => `/api/network/students/${encodeURIComponent(ref)}`
const advisorPath = (ref: string) => `/api/network/advisors/me/students/${encodeURIComponent(ref)}`

/**
 * The student's own support network and the advisor's read of the same student share one read
 * model; only the base path differs (the gateway enforces who may call which one).
 */
export const networkApi = {
  supportNetwork: (studentRef: string) => request<SupportNetworkView>(`${studentPath(studentRef)}/support-network`),
  supportNetworkAsAdvisor: (studentRef: string) =>
    request<SupportNetworkView>(`${advisorPath(studentRef)}/support-network`),

  /** One person of the network, opened: contact details and a short summary. */
  connection: (studentRef: string, personReference: string) =>
    request<ConnectionDetail>(
      `${studentPath(studentRef)}/connections/${encodeURIComponent(personReference)}`,
    ),
  connectionAsAdvisor: (studentRef: string, personReference: string) =>
    request<ConnectionDetail>(
      `${advisorPath(studentRef)}/connections/${encodeURIComponent(personReference)}`,
    ),

  createConnection: (studentRef: string, body: UpsertConnectionRequest) =>
    request<UpsertConnectionResult>(`${studentPath(studentRef)}/connections`, { body }),
  updateConnection: (studentRef: string, personReference: string, body: UpsertConnectionRequest) =>
    request<UpsertConnectionResult>(
      `${studentPath(studentRef)}/connections/${encodeURIComponent(personReference)}`,
      { method: 'PATCH', body },
    ),
  removeConnection: (studentRef: string, personReference: string) =>
    request<void>(`${studentPath(studentRef)}/connections/${encodeURIComponent(personReference)}`, {
      method: 'DELETE',
    }),
}
