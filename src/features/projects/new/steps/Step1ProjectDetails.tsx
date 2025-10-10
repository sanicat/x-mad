import { useId, useMemo, useState } from 'react'
import { useProjectDraft } from '../useProjectDraft'
import type { Equipment } from '../types'
import { EquipmentPicker } from '../components/EquipmentPicker'

const MAX_TITLE = 120
const MAX_DESC = 800

function useMockEquipment(): { verified: Equipment[]; custom: Equipment[] } {
  return useMemo(() => {
    const names = [
      'UV-Vis Spectrophotometer','Incubator','Conductivity Meter','Autoclave','Analytical Balance','HPLC System','TOC Analyzer','Water Purification System','Fume Hood / Laminar Flow Cabinet','COD Analyzer'
    ]
    const verified = names.map((n, i) => ({ id: `v${i+1}`, name: n, verified: true }))
    const custom = ['Custom Meter','Custom Cabinet'].map((n, i) => ({ id: `c${i+1}`, name: n, verified: false }))
    return { verified, custom }
  }, [])
}

export default function Step1ProjectDetails() {
  const { draft, setTitle, setDescription, toggleEquipment } = useProjectDraft()
  const [descCount, setDescCount] = useState(draft.description?.length ?? 0)
  const [touched, setTouched] = useState(false)
  const titleId = useId()
  const errId = useId()

  const { verified, custom } = useMockEquipment()

  const titleValid = draft.title.trim().length > 0 && draft.title.length <= MAX_TITLE

  return (
    <div className="grid gap-6">
      <div>
        <label htmlFor={titleId} className="block text-sm font-medium">Project Title</label>
        <input
          id={titleId}
          className="mt-1 w-full rounded-lg border border-[#D8DDE4] px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]"
          placeholder="Enter project title"
          value={draft.title}
          onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
          onBlur={() => setTouched(true)}
          aria-describedby={!titleValid ? errId : undefined}
          aria-invalid={!titleValid}
        />
        {!titleValid && touched && (
          <p id={errId} className="mt-1 text-sm text-rose-600">Title is required and must be ≤ {MAX_TITLE} characters.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Project Description</label>
        <textarea
          className="mt-1 w-full resize-y rounded-lg border border-[#D8DDE4] px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]"
          rows={4}
          placeholder="Project description"
          value={draft.description || ''}
          onChange={(e) => { const v = e.target.value.slice(0, MAX_DESC); setDescription(v); setDescCount(v.length) }}
        />
        <div className="mt-1 text-right text-xs text-gray-500">{descCount}/{MAX_DESC}</div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Select Equipment</div>
        <EquipmentPicker
          verified={verified}
          custom={custom}
          selectedIds={draft.equipmentIds}
          onToggle={toggleEquipment}
        />
      </div>
    </div>
  )
}
