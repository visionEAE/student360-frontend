import { Link } from 'react-router-dom'
import { fetchAcademicStatus, fetchEngagementSignals, fetchFinancialStatus, fetchStudent } from '../api/student'
import { useSession } from '../auth/useSession'
import { Panel } from '../components/Panel'
import { useLoad } from '../components/useLoad'

const money = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

export function StudentViewScreen() {
  const { profile } = useSession()
  const ref = profile?.externalReference ?? ''
  const student = useLoad(() => fetchStudent(ref), [ref])
  const academic = useLoad(() => fetchAcademicStatus(ref), [ref])
  const financial = useLoad(() => fetchFinancialStatus(ref), [ref])
  const engagement = useLoad(() => fetchEngagementSignals(ref), [ref])

  return (
    <main>
      <header className="row">
        <h1>360° view · {ref}</h1>
        <Link to="/wellbeing" className="button">
          Record how I feel
        </Link>
      </header>
      <div className="grid">
        <Panel title="Profile" loading={student.loading} error={student.error}>
          {student.data && (
            <dl>
              <dt>Name</dt>
              <dd>{student.data.fullName}</dd>
              <dt>Program</dt>
              <dd>
                {student.data.program.name} ({student.data.program.code}) · {student.data.program.faculty}
              </dd>
              <dt>Admission</dt>
              <dd>{student.data.admissionTerm}</dd>
              <dt>Status</dt>
              <dd>{student.data.status}</dd>
            </dl>
          )}
        </Panel>
        <Panel title="Academic status" loading={academic.loading} error={academic.error}>
          {academic.data && (
            <>
              <dl>
                <dt>Current term</dt>
                <dd>{academic.data.currentTerm}</dd>
                <dt>Standing</dt>
                <dd>
                  <span className={`badge ${academic.data.academicStanding.toLowerCase()}`}>
                    {academic.data.academicStanding}
                  </span>
                </dd>
                <dt>Cumulative GPA</dt>
                <dd>{academic.data.cumulativeGpa.toFixed(2)}</dd>
                <dt>Credits enrolled</dt>
                <dd>{academic.data.creditsEnrolled}</dd>
              </dl>
              <table>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Enrolled</th>
                    <th>Approved</th>
                    <th>Term GPA</th>
                    <th>Standing</th>
                  </tr>
                </thead>
                <tbody>
                  {academic.data.history.map((term) => (
                    <tr key={term.term}>
                      <td>{term.term}</td>
                      <td>{term.creditsEnrolled}</td>
                      <td>{term.creditsApproved}</td>
                      <td>{term.termGpa === null ? '—' : term.termGpa.toFixed(2)}</td>
                      <td>{term.academicStanding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Panel>
        <Panel title="Financial status" loading={financial.loading} error={financial.error}>
          {financial.data && (
            <dl>
              <dt>Outstanding balance</dt>
              <dd>{money(financial.data.outstandingBalance)}</dd>
              <dt>Overdue</dt>
              <dd>
                {financial.data.overdue ? (
                  <span className="badge at_risk">
                    {money(financial.data.overdueBalance)} · {financial.data.daysOverdue} days
                  </span>
                ) : (
                  <span className="badge good">Up to date</span>
                )}
              </dd>
              <dt>Payment plan</dt>
              <dd>{financial.data.paymentPlan ? 'Yes' : 'No'}</dd>
              <dt>Financial hold</dt>
              <dd>{financial.data.financialHold ? 'Yes' : 'No'}</dd>
            </dl>
          )}
        </Panel>
        <Panel title="Engagement (learning platform)" loading={engagement.loading} error={engagement.error}>
          {engagement.data && (
            <dl>
              <dt>Days since last access</dt>
              <dd>{engagement.data.daysSinceLastAccess ?? 'never accessed'}</dd>
              <dt>On-time submission rate</dt>
              <dd>
                {engagement.data.onTimeSubmissionRate === null
                  ? '—'
                  : `${Math.round(engagement.data.onTimeSubmissionRate * 100)}%`}
              </dd>
              <dt>Courses without activity</dt>
              <dd>
                {engagement.data.coursesWithoutActivity} of {engagement.data.activeCourses}
              </dd>
              <dt>Late / missing submissions</dt>
              <dd>
                {engagement.data.lateSubmissions} / {engagement.data.missingSubmissions}
              </dd>
            </dl>
          )}
        </Panel>
      </div>
    </main>
  )
}
