export type Equipment = { id: string; name: string; verified: boolean }

export type ProjectDraft = {
  title: string
  description?: string
  equipmentIds: string[]
  step: 1 | 2 | 3
  riskAnswer?: string
  riskLevel: 'low' | 'medium' | 'high'
  requiredPhases: string[]
  assigneeIds: string[]
}
