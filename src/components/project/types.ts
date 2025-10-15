export type StageKey =
  | 'URS'
  | 'FRS'
  | 'DQ'
  | 'IQ'
  | 'PQ'
  | 'OQ'
  | 'Execution'
  | 'Signoff'
  | 'Verification'
  | 'Completed'

export type PhaseStatus = 'In-Progress' | 'Completed' | 'Not Started' | 'Working on'

export interface Member {
  id: string
  name: string
  avatarUrl?: string
}

export interface Project {
  id: string
  title: string
  dueDate: string
  progressPct: number
  members: Member[]
  daysLeft?: number
}

export interface Task {
  id: string
  stage: StageKey
  title: string
  body: string
  dueDate: string
  warnings?: number
  comments?: number
  attachments?: number
  assignees: Member[]
  label?: 'Creation' | 'Verification' | 'Execution' | 'Signoff' | 'Completed'
  labelDaysLeft?: number
  updatedAt?: Date
}

export interface Phase {
  id: string
  name: StageKey
  status: PhaseStatus
  updatedAt: Date
  assignees: Member[]
  lead?: Member
  dueDate: string
  tasks: Task[]
}
