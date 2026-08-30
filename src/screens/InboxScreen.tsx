import { Link } from 'react-router-dom'
import { fetchInbox } from '../api/advisor'
import { useSession } from '../auth/useSession'
import { Panel } from '../components/Panel'
import { useLoad } from '../lib/useLoad'

export function InboxScreen() {
  const { profile } = useSession()
  const inbox = useLoad(fetchInbox, [profile?.id])

  return (
    <main>
      <h1>Alert inbox · {profile?.externalReference}</h1>
      <Panel title="Alerts for students assigned to you" loading={inbox.loading} error={inbox.error}>
        {inbox.data && inbox.data.length === 0 && <p className="muted">No alerts for your students.</p>}
        {inbox.data && inbox.data.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Generated</th>
                <th>Fired conditions</th>
              </tr>
            </thead>
            <tbody>
              {inbox.data.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <Link to={`/alerts/${alert.id}`}>{alert.studentId}</Link>
                  </td>
                  <td>
                    <span className={`badge ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                  </td>
                  <td>{alert.status}</td>
                  <td>{new Date(alert.generatedAt).toLocaleString()}</td>
                  <td className="small">{alert.firedConditions.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </main>
  )
}
