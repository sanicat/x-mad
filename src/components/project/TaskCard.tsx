import { motion } from 'framer-motion'
import { cn } from '../ui/utils'
import type { Member, Task } from './types'
import { AlertTriangle, MessageSquareText, Paperclip, MoreHorizontal } from 'lucide-react'

export interface TaskCardProps {
  task: Task
  onOpen?: (id: string) => void
  className?: string
}

const labelStyles = {
  Creation: { bg: 'bg-amber-500', text: 'text-white' },
  Verification: { bg: 'bg-indigo-500', text: 'text-white' },
  Execution: { bg: 'bg-blue-600', text: 'text-white' },
  Signoff: { bg: 'bg-red-500', text: 'text-white' },
  Completed: { bg: 'bg-green-500', text: 'text-white' },
}

function TinyAvatars({ people }: { people: Member[] }) {
  return (
    <div className="flex -space-x-2">
      {people.slice(0, 3).map((m) => (
        <img
          key={m.id}
          src={m.avatarUrl || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22%231f3a9d%22/></svg>'}
          alt={m.name}
          className="h-6 w-6 rounded-full border-2 border-white object-cover shadow-sm"
          loading="lazy"
          decoding="async"
          width={24}
          height={24}
          sizes="24px"
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
      {people.length > 3 && (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-700">
          +{people.length - 3}
        </span>
      )}
    </div>
  )
}

export default function TaskCard({ task, className, onOpen }: TaskCardProps) {
  const days = task.labelDaysLeft ?? 0
  const label = task.label ?? 'Execution'
  const { bg: labelBg, text: labelText } = labelStyles[label] || { bg: 'bg-gray-500', text: 'text-white' }

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      tabIndex={0}
      onClick={() => onOpen?.(task.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen?.(task.id) }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-sm outline-none transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500',
        className,
      )}
    >
      {/* Header bar */}
      <div
        className={cn(
          'flex h-8 items-center justify-between rounded-t-lg px-3 text-xs font-bold',
          labelBg,
          labelText
        )}
        role="heading"
        aria-level={3}
      >
        <span>{label}{days ? ` (${days} days left)` : ''}</span>
        <button
          type="button"
          aria-label="Open quick menu"
          className="inline-flex h-6 w-6 items-center justify-center rounded text-white/90 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          onClick={(e) => {
            e.stopPropagation()
            // TODO: hook up DropdownMenu
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        {task.body && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {task.body}
          </p>
        )}

        {/* Avatars */}
        {task.assignees?.length > 0 && (
          <div className="mt-2">
            <TinyAvatars people={task.assignees} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Icons row */}
            <div className="flex items-center gap-4">
              {task.warnings ? (
                <span className="flex items-center gap-1 text-xs text-[#1f3a9d]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{task.warnings}</span>
                </span>
              ) : null}
              <span className="flex items-center gap-1 text-xs text-[#1f3a9d]">
                <MessageSquareText className="h-3.5 w-3.5" />
                <span>{task.comments ?? 0}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-[#1f3a9d]">
                <Paperclip className="h-3.5 w-3.5" />
                <span>{task.attachments ?? 0}</span>
              </span>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <span className="text-xs font-medium text-[#1f3a9d]">
                {task.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
