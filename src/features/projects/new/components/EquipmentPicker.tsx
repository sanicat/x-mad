import { useMemo, useState } from 'react'
import type { Equipment } from '../types'
import { EquipmentTabs } from './EquipmentTabs'
import { EquipmentSearch } from './EquipmentSearch'
import { EquipmentChips } from './EquipmentChips'
import { EquipmentInlineAdd } from './EquipmentInlineAdd'

export function EquipmentPicker({ verified, custom, selectedIds, onToggle }: { verified: Equipment[]; custom: Equipment[]; selectedIds: string[]; onToggle: (id: string) => void }) {
  const [tab, setTab] = useState<'verified' | 'new'>('verified')
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [customItems, setCustomItems] = useState<Equipment[]>(custom)

  const filteredVerified = useMemo(() => verified.filter(e => e.name.toLowerCase().includes(q.toLowerCase())), [verified, q])
  const filteredCustom = useMemo(() => customItems.filter(e => e.name.toLowerCase().includes(q.toLowerCase())), [customItems, q])

  return (
    <div>
      <div className="flex items-center justify-between">
        <EquipmentTabs active={tab} counts={{ verified: verified.length, new: customItems.length }} onChange={setTab} />
        <button type="button" className="text-sm text-[#1f3a9d] hover:underline" onClick={() => setAdding(a => !a)}>Add Equipment</button>
      </div>
      <div className="mt-2">
        <EquipmentSearch value={q} onChange={setQ} onClear={() => setQ('')} placeholder="Search equipment" />
      </div>
      {adding && (
        <EquipmentInlineAdd
          onConfirm={(name) => { 
            const id = `c_${Date.now()}`
            setCustomItems(list => [...list, { id, name, verified: false }])
            onToggle(id)
            setAdding(false)
          }}
          onCancel={() => setAdding(false)}
          existingNames={[...verified, ...customItems].map(e => e.name)}
        />
      )}
      <div className="mt-2">
        {tab === 'verified' ? (
          <EquipmentChips items={filteredVerified} selectedIds={selectedIds} onToggle={onToggle} verifiedBadge />
        ) : (
          <EquipmentChips items={filteredCustom} selectedIds={selectedIds} onToggle={onToggle} />
        )}
      </div>
    </div>
  )
}
