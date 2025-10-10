import { useState } from 'react'

export function EquipmentInlineAdd({ onConfirm, onCancel, existingNames }: { onConfirm: (name: string) => void; onCancel: () => void; existingNames: string[] }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  function confirm() {
    const name = value.trim()
    if (!name) return
    if (existingNames.some(n => n.toLowerCase() === name.toLowerCase())) {
      setError('This equipment already exists')
      return
    }
    onConfirm(name)
    setValue('')
    setError(null)
  }
  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        className="flex-1 rounded-lg border px-3 py-2 outline-none"
        placeholder="Enter new equipment"
        value={value}
        onChange={(e) => { setValue(e.target.value); if (error) setError(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') onCancel(); }}
        aria-label="Enter new equipment"
      />
      <button aria-label="Confirm add" onClick={confirm} className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700">✔</button>
      <button aria-label="Cancel add" onClick={onCancel} className="rounded bg-rose-600 px-3 py-2 text-white hover:bg-rose-700">✖</button>
      <div className="sr-only" aria-live="polite">{error ? error : ''}</div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  )
}
