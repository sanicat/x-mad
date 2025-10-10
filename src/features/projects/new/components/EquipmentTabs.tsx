export function EquipmentTabs({ active, counts, onChange }: { active: 'verified' | 'new'; counts: { verified: number; new: number }; onChange: (v: 'verified' | 'new') => void }) {
  return (
    <div className="flex items-center gap-6">
      {(['verified','new'] as const).map(key => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={[
            'relative pb-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]',
            active === key ? 'text-[#1f3a9d]' : 'text-gray-600 hover:text-gray-900',
          ].join(' ')}
          aria-selected={active === key}
          role="tab"
        >
          {key === 'verified' ? 'AI Verified Equipment' : 'New Equipment'}
          <span className="ml-2 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-200 px-1 text-xs text-gray-700">{counts[key]}</span>
          {active === key && <span className="absolute inset-x-0 -bottom-[2px] h-[3px] rounded-full bg-[#1f3a9d]" aria-hidden />}
        </button>
      ))}
    </div>
  )
}
