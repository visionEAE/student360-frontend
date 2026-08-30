import { useSession } from '../auth/useSession'
import { StudentInformationDisplayPage } from './StudentInformationDisplayPage'

/** `/me/overview` — minimum requirement: personal, academic, financial data and campus activity in one place. */
export function StudentOverviewPage() {
  const { profile } = useSession()
  return <StudentInformationDisplayPage ownReference={profile?.externalReference ?? ''} />
}
