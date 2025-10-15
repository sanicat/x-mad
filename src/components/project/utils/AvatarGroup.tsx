import type { Member } from '../types'

export interface AvatarGroupProps {
  members: Member[]
  maxVisible?: number
  size?: 'sm' | 'md'
}

export default function AvatarGroup({ members, maxVisible = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = members.slice(0, maxVisible)
  const overflow = members.length - maxVisible
  const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  const allNames = members.map((m) => m.name).join(', ')

  return (
    <div className="flex items-center gap-2" title={allNames} aria-label={`Assignees: ${allNames}`}>
      <div className="flex -space-x-2">
        {visible.map((m) => (
          <img
            key={m.id}
            src={
              m.avatarUrl ||
              'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22%231f3a9d%22/></svg>'
            }
            alt={m.name}
            className={`${sizeClass} rounded-full border-2 border-white object-cover ring-1 ring-gray-200`}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const img = e.currentTarget
              if (!img.dataset.fallback) {
                img.dataset.fallback = '1'
                const BASE = (import.meta as any).env?.BASE_URL ?? '/'
                img.src = `${BASE}users_profile/default.svg`
              }
            }}
          />
        ))}
        {overflow > 0 && (
          <div
            className={`${sizeClass} inline-flex items-center justify-center rounded-full border-2 border-white bg-gray-100 ${textSize} font-medium text-gray-600 ring-1 ring-gray-200`}
            aria-label={`+${overflow} more`}
          >
            +{overflow}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className={`${textSize} font-medium text-[hsl(var(--fg))]`}>
          {visible.length > 0 ? visible[0].name : 'No assignee'}
        </span>
        {overflow > 0 && (
          <span className="text-xs text-gray-500">+{overflow} more</span>
        )}
      </div>
    </div>
  )
}
