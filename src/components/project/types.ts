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
}
