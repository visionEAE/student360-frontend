/* Types mirror student360-infra/docs/api-contract-v2.md. */

// ---------- auth ----------
export interface UserProfile {
  id: string
  email: string
  fullName: string
  roles: string[]
  externalReference: string | null
}

// ---------- core-service ----------
export type StudentStatus = 'ACTIVE' | 'ON_LEAVE' | 'WITHDRAWN'
export type AcademicStanding = 'GOOD' | 'PROBATION' | 'AT_RISK'

export interface ProgramRef {
  code: string
  name: string
  faculty?: string
  totalSemesters?: number | null
}

export interface StudentProfile {
  id: string
  code: string | null
  fullName: string
  firstName?: string
  lastName?: string
  email: string
  program: ProgramRef
  currentSemester: number | null
  admissionTerm: string
  status: StudentStatus
  enrollmentStatus: string | null
}

export interface GpaPoint {
  semester: number
  term: string
  termGpa: number | null
}

export interface CourseGrade {
  code: string
  name: string
  credits: number
  currentGrade: number | null
}

export interface AcademicStatus {
  studentId: string
  currentTerm: string
  currentSemester: number | null
  totalSemesters: number | null
  academicStanding: AcademicStanding
  enrollmentStatus: string | null
  cumulativeGpa: number
  creditsEnrolled: number
  gpaHistory: GpaPoint[]
  currentCourses: CourseGrade[]
  sourceUpdatedAt: string | null
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE'

export interface Payment {
  date: string
  description: string
  amount: number
  status: PaymentStatus
}

export interface FinancialStatus {
  studentId: string
  tuitionAmount: number | null
  paidAmount: number | null
  outstandingBalance: number
  overdueBalance: number
  daysOverdue: number
  overdue: boolean
  dueDate: string | null
  paymentPlan: string | null
  scholarship: string | null
  financialHold: boolean
  payments: Payment[]
  updatedAt: string | null
}

// ---------- lms-service ----------
export type Participation = 'ACTIVE' | 'MODERATE' | 'LOW' | 'INACTIVE'

export interface EngagementSignals {
  studentId: string
  computedAt: string
  daysSinceLastAccess: number | null
  lastAccessAt?: string | null
  onTimeSubmissionRate: number | null
  coursesWithoutActivity: number
  activeCourses: number
  accessCount30d?: number | null
  lateSubmissions: number
  missingSubmissions: number
}

export interface CourseActivity {
  courseCode: string
  courseName: string
  lastAccessAt: string | null
  daysSinceLastAccess: number | null
  onTime: number
  late: number
  missing: number
  participation: Participation
}

export interface EngagementActivity {
  studentId: string
  windowDays: number
  accessCount: number
  lastAccessAt: string | null
  submissions: { onTime: number; late: number; missing: number }
  courses: CourseActivity[]
}

// ---------- support-service ----------
export type Dimension = 'ECONOMIC' | 'ACADEMIC' | 'EMOTIONAL'
export type Mood = 'DIFFICULT' | 'FAIR' | 'GOOD' | 'VERY_GOOD'
export type EntryStatus = 'DRAFT' | 'SENT'

export interface WellbeingDimensionInput {
  dimension: Dimension
  mood: Mood
  needs: string[]
  note?: string | null
}

export interface WellbeingEntryRequest {
  status: EntryStatus
  dimensions: WellbeingDimensionInput[]
}

export interface WellbeingEntryResult {
  entryId: string
  status: EntryStatus
  level: number | null
  alertGenerated: boolean
  alertId: string | null
}

export interface WellbeingDraft {
  entryId: string
  status: 'DRAFT'
  dimensions: WellbeingDimensionInput[]
}

export interface WellbeingWeek {
  weekStart: string
  label: string
  level: number | null
}

export interface WellbeingEntrySummary {
  entryId: string
  recordedAt: string
  level: number
  summaryNote: string | null
  dimensions: WellbeingDimensionInput[]
}

export interface WellbeingSummary {
  studentId: string
  currentLevel: number | null
  currentLevelLabel: 'LOW' | 'MEDIUM' | 'GOOD' | null
  entriesThisMonth: number
  trend: 'UP' | 'DOWN' | 'STABLE' | null
  weekly: WellbeingWeek[]
  recent: WellbeingEntrySummary[]
}

export type StatusLevel = 'ON_TRACK' | 'WATCH' | 'AT_RISK' | 'UNKNOWN'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface StudentOverviewRow {
  studentId: string
  code: string | null
  fullName: string
  initials: string
  program: string
  currentSemester: number | null
  academicStatus: StatusLevel
  financialStatus: StatusLevel
  emotionalStatus: StatusLevel
  overallRisk: RiskLevel
  openAlertId: string | null
  lastUpdatedAt: string | null
}

export interface AdvisorStudentsOverview {
  advisorReference: string
  students: StudentOverviewRow[]
  unavailableSources: string[]
}

export type Severity = 'MEDIUM' | 'HIGH'
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'CLOSED'
export type PlanType = 'INTEGRAL_SUPPORT' | 'ACADEMIC_FOLLOW_UP'
export type PlanStatus = 'PROPOSED' | 'ACTIVE' | 'COMPLETED'
export type RequestType =
  | 'FINANCIAL_WELLBEING_REFERRAL'
  | 'PSYCHOLOGICAL_SUPPORT_REFERRAL'
  | 'TUTORING'
  | 'WORKLOAD_ADJUSTMENT'
  | 'PROFESSOR_MEETING'
  | 'OTHER'
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export interface TriggeringSignals {
  wellbeingLevel: number | null
  daysSinceLastAccess: number | null
  onTimeSubmissionRate: number | null
  coursesWithoutActivity: number | null
  overdueBalance: number | null
  daysOverdue: number | null
  financialHold: boolean | null
  firedConditions: string[]
  unavailableSources: string[]
  reason?: string | null
}

export interface InterventionPlan {
  id: string
  studentId?: string
  studentName?: string | null
  type: PlanType
  description: string
  status: PlanStatus
  alertId?: string | null
  createdBy?: string | null
  createdAt?: string | null
}

export interface SupportReport {
  id: string
  alertId: string | null
  studentId?: string
  advisorId?: string
  content: string
  createdAt: string
}

export interface SupportRequest {
  id: string
  studentId: string
  type: RequestType
  description: string
  status: RequestStatus
  alertId: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string | null
  resolution: string | null
}

export interface AlertSummary {
  id: string
  studentId: string
  severity: Severity
  status: AlertStatus
  generatedAt: string
  firedConditions: string[]
}

export interface AlertDetail {
  id: string
  studentId: string
  severity: Severity
  status: AlertStatus
  source: string
  generatedAt: string
  triggeringSignals: TriggeringSignals
  interventionPlan: InterventionPlan | null
  reports: SupportReport[]
}

export interface StudentCase {
  student: StudentProfile
  assignment: { advisorReference: string; validFrom: string | null } | null
  academic: AcademicStatus | null
  financial: FinancialStatus | null
  engagement: EngagementSignals | null
  activeAlert: AlertDetail | null
  wellbeing: WellbeingSummary | null
  requests: SupportRequest[]
  reports: SupportReport[]
  unavailableSources: string[]
}

// ---------- network-service (support network) ----------
export type PersonKind = 'STUDENT' | 'ADVISOR' | 'PROFESSOR' | 'FAMILY' | 'PEER' | 'COUNSELOR' | 'OTHER'
export type RelationshipLabel =
  | 'FAMILY'
  | 'FRIEND'
  | 'ADVISOR'
  | 'MENTOR'
  | 'COUNSELOR'
  | 'PROFESSOR'
  | 'PEER'
  | 'OTHER'
export type RaterType = 'SELF' | 'SUPPORT_TEAM'

export interface PersonView {
  reference: string
  kind: PersonKind
  displayName: string | null
}

export interface EdgeView {
  weight: number
  relationshipLabel: RelationshipLabel
  ratedBy: RaterType
  updatedAt: string
}

export interface ConnectionView {
  person: PersonView
  edges: EdgeView[]
}

export interface SupportNetworkView {
  studentId: string
  connections: ConnectionView[]
  primarySupport: ConnectionView | null
  averageWeight: number | null
}

export interface PersonRefInput {
  reference?: string
  kind: PersonKind
  displayName?: string
  /** Only meaningful for people core-service has no record of; see ContactView.source. */
  email?: string
  phone?: string
  summary?: string
}

/**
 * `DIRECTORY` — resolved from core-service's directory (a professor, a fellow student).
 * `SELF_REPORTED` — typed in by whoever added the person (family, a friend, an advisor).
 * `NONE` — nothing on file, including when the directory could not be reached.
 */
export type ContactSource = 'DIRECTORY' | 'SELF_REPORTED' | 'NONE'

export interface ContactView {
  email: string | null
  phone: string | null
  summary: string | null
  /** Program or department — only ever present for a DIRECTORY-resolved person. */
  headline: string | null
  source: ContactSource
}

export interface ConnectionDetail {
  studentId: string
  person: PersonView
  contact: ContactView
  edges: EdgeView[]
}

export interface UpsertConnectionRequest {
  person: PersonRefInput
  relationshipLabel: RelationshipLabel
  weight: number
  note?: string
}

// ---------- core-service (directory search) ----------
export interface DirectoryEntry {
  reference: string
  kind: 'STUDENT' | 'PROFESSOR'
  displayName: string
}

export interface UpsertConnectionResult {
  personReference: string
  weight: number
}
