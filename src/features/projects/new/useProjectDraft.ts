import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ProjectDraft } from './types'

const DraftCtx = createContext<{
  draft: ProjectDraft
  setTitle: (t: string) => void
  setDescription: (d: string) => void
  toggleEquipment: (id: string) => void
  setStep: (s: 1|2|3) => void
  setRiskAnswer: (a: string) => void
  setRiskLevel: (l: 'low'|'medium'|'high') => void
  setRequiredPhases: (p: string[]) => void
  toggleAssignee: (id: string) => void
} | null>(null)

export function ProjectDraftProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<ProjectDraft> }) {
  const [draft, setDraft] = useState<ProjectDraft>({ title: '', description: '', equipmentIds: [], assigneeIds: [], step: 1, riskAnswer: undefined, riskLevel: 'low', requiredPhases: ['URS','FRS','DQ'], ...initial })
  const setTitle = useCallback((t: string) => setDraft(d => ({ ...d, title: t })), [])
  const setDescription = useCallback((desc: string) => setDraft(d => ({ ...d, description: desc })), [])
  const toggleEquipment = useCallback((id: string) => setDraft(d => ({ ...d, equipmentIds: d.equipmentIds.includes(id) ? d.equipmentIds.filter(x => x !== id) : [...d.equipmentIds, id] })), [])
  const setStep = useCallback((s: 1|2|3) => setDraft(d => ({ ...d, step: s })), [])
  const setRiskAnswer = useCallback((a: string) => setDraft(d => ({ ...d, riskAnswer: a })), [])
  const setRiskLevel = useCallback((l: 'low'|'medium'|'high') => setDraft(d => ({ ...d, riskLevel: l })), [])
  const setRequiredPhases = useCallback((p: string[]) => setDraft(d => ({ ...d, requiredPhases: p })), [])
  const toggleAssignee = useCallback((id: string) => setDraft(d => ({ ...d, assigneeIds: d.assigneeIds.includes(id) ? d.assigneeIds.filter(x => x !== id) : [...d.assigneeIds, id] })), [])
  const value = useMemo(() => ({ draft, setTitle, setDescription, toggleEquipment, setStep, setRiskAnswer, setRiskLevel, setRequiredPhases, toggleAssignee }), [draft, setTitle, setDescription, toggleEquipment, setStep, setRiskAnswer, setRiskLevel, setRequiredPhases, toggleAssignee])
  return React.createElement(DraftCtx.Provider, { value }, children)
}

export function useProjectDraft() {
  const ctx = useContext(DraftCtx)
  if (!ctx) throw new Error('useProjectDraft must be used within ProjectDraftProvider')
  return ctx
}
