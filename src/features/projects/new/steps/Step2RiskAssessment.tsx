import { useEffect, useId, useMemo, useState } from 'react'
import { useProjectDraft } from '../useProjectDraft'
import { PriorityBadge } from '../../../../components/projects/PriorityBadge'
import { PhasePill } from '../../../../components/projects/PhasePill'

const QUESTIONS: string[] = [
  'Risks and integrate safety practices into performing the tasks where appropriate?',
  'Are biosafety-related policies and procedures managed in a document control system to ensure that the most current documents are in use and available?',
  'Does the laboratory have a TB Infection Control Policy?',
  'When accidents, incidents, or near misses are reported, is a root cause analysis conducted and corrective actions identified, documented, and addressed?',
  'Are self-audits of the biosafety management systems and accident/incident reports performed annually to assess effectiveness and compliance and initiate improved methods and engineering controls as needed?',
]

function phasesFor(level: 'low'|'medium'|'high'): string[] {
  if (level === 'low') return ['URS','FRS','DQ']
  if (level === 'medium') return ['URS','FRS','DQ','IQ']
  return ['URS','FRS','DQ','IQ','PQ']
}

export default function Step2RiskAssessment() {
  const { draft, setRiskAnswer, setRequiredPhases } = useProjectDraft()
  const groupId = useId()
  const labelId = useId()
  const [selected, setSelected] = useState<string | undefined>(draft.riskAnswer)
  const level: 'low'|'medium'|'high' = draft.riskLevel || 'low'

  useEffect(() => {
    // Ensure required phases reflect current risk level in draft
    setRequiredPhases(phasesFor(level))
  }, [level, setRequiredPhases])

  useEffect(() => {
    if (selected) setRiskAnswer(selected)
  }, [selected, setRiskAnswer])

  const chips = useMemo(() => draft.requiredPhases, [draft.requiredPhases])

  return (
    <div className="grid gap-6">
      <section>
        <h3 id={labelId} className="mb-2 text-sm font-medium">Select Risk</h3>
        <div role="radiogroup" aria-labelledby={labelId} className="grid gap-3">
          {QUESTIONS.map((q, idx) => {
            const id = `${groupId}-${idx}`
            const checked = selected === q
            return (
              <label 
                key={id} 
                className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors ${
                  checked 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="relative mt-0.5 flex h-5 w-5 items-center justify-center">
                  <input
                    type="radio"
                    name={groupId}
                    id={id}
                    className={`h-4 w-4 appearance-none rounded-full border-2 ${
                      checked ? 'border-blue-500' : 'border-gray-300'
                    } bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    checked={checked}
                    onChange={() => setSelected(q)}
                  />
                  {checked && (
                    <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </div>
                <span className="flex-1 text-sm text-gray-800">{q}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <h3 className="text-sm font-medium">Required Phases</h3>
          <PriorityBadge priority={level} />
        </div>
        <div className="flex flex-wrap gap-2 transition-all duration-300 motion-reduce:transition-none">
          {chips.map(code => (
            <PhasePill key={code} code={code} variant="dialog" />
          ))}
        </div>
      </section>
    </div>
  )
}
