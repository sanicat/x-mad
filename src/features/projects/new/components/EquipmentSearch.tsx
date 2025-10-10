import { useEffect, useState } from 'react'

export function EquipmentSearch({ value, onChange, placeholder, onClear }: { value: string; onChange: (v: string) => void; placeholder?: string; onClear: () => void }) {
  const [inner, setInner] = useState(value)
  useEffect(() => setInner(value), [value])
  useEffect(() => {
    const id = setTimeout(() => {
      if (inner !== value) onChange(inner)
    }, 250)
    return () => clearTimeout(id)
  }, [inner, value, onChange])

  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#D8DDE4] px-3 py-2">
      <span aria-hidden>🔎</span>
      <input
        className="w-full bg-transparent outline-none"
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder || 'Search equipment'}
        aria-label="Search equipment"
      />
      {inner && (
        <button aria-label="Clear search" onClick={() => { setInner(''); onChange(''); onClear(); }} className="rounded p-1 hover:bg-black/5">✕</button>
      )}
    </div>
  )
}
