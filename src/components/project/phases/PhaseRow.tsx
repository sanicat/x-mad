import { useId, useRef, useEffect } from 'react'
import { ChevronRight, Calendar, Edit, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Phase } from '../types'
import StatusBadge from '../utils/StatusBadge'
import RelativeTime from '../utils/RelativeTime'
import AvatarGroup from '../utils/AvatarGroup'
import IconActionButton from '../utils/IconActionButton'
import TasksSubtable from './TasksSubtable'

export interface PhaseRowProps {
  phase: Phase
  isExpanded: boolean
  onToggleExpand: (phaseId: string) => void
  onOpenTask: (taskId: string) => void
  onEditTask: (taskId: string) => void
  onEditPhase: (phaseId: string) => void
  onViewPhase: (phaseId: string) => void
  onAddTask: (phaseId: string) => void
}

export default function PhaseRow({
  phase,
  isExpanded,
  onToggleExpand,
  onOpenTask,
  onEditTask,
  onEditPhase,
  onViewPhase,
  onAddTask,
}: PhaseRowProps) {
  const expandedRegionId = useId()
  const caretButtonRef = useRef<HTMLButtonElement>(null)
  const firstTaskRef = useRef<HTMLDivElement>(null)

  // Focus management
  useEffect(() => {
    if (isExpanded && firstTaskRef.current) {
      // When expanding, move focus to first task
      const firstFocusable = firstTaskRef.current.querySelector('button') as HTMLElement
      firstFocusable?.focus()
    }
  }, [isExpanded])

  const handleToggle = () => {
    onToggleExpand(phase.id)
    // When collapsing, focus returns to caret button automatically
    if (isExpanded) {
      setTimeout(() => caretButtonRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  return (
    <>
      <div
        role="row"
        className="grid grid-cols-[auto_1.5fr_1fr_1.5fr_1.5fr_1.5fr_auto] items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 text-sm transition-colors hover:bg-gray-50/50"
      >
        {/* Expand/Collapse Caret */}
        <div role="cell">
          <button
            ref={caretButtonRef}
            type="button"
            aria-expanded={isExpanded}
            aria-controls={expandedRegionId}
            aria-label={isExpanded ? `Collapse ${phase.name} phase` : `Expand ${phase.name} phase`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-[hsl(var(--fg))]/60 transition-transform hover:bg-[hsl(var(--surface-muted))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </motion.div>
          </button>
        </div>

        {/* Name */}
        <div role="cell" className="font-semibold text-[hsl(var(--fg))]">
          {phase.name}
        </div>

        {/* Status */}
        <div role="cell">
          <StatusBadge status={phase.status} />
        </div>

        {/* Last Updated */}
        <div role="cell" className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6" />
            </svg>
          </div>
          <RelativeTime datetime={phase.updatedAt} />
        </div>

        {/* Assignee */}
        <div role="cell">
          <AvatarGroup members={phase.assignees} maxVisible={3} showNames={!!phase.lead} size="sm" />
        </div>

        {/* Due Date */}
        <div role="cell" className="flex items-center gap-1.5 text-xs text-[hsl(var(--fg))]/60">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <time dateTime={phase.dueDate}>{phase.dueDate}</time>
        </div>

        {/* Actions */}
        <div role="cell" className="flex items-center gap-1">
          <IconActionButton
            ariaLabel={`Edit ${phase.name} phase`}
            onClick={() => onEditPhase(phase.id)}
            icon={<Edit className="h-4 w-4" />}
          />
          <IconActionButton
            ariaLabel={`View ${phase.name} phase`}
            onClick={() => onViewPhase(phase.id)}
            icon={<Eye className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Expanded Tasks Region */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <div id={expandedRegionId} ref={firstTaskRef} aria-label={`${phase.name} tasks`}>
            <TasksSubtable
              tasks={phase.tasks}
              phaseId={phase.id}
              onOpenTask={onOpenTask}
              onEditTask={onEditTask}
              onAddTask={onAddTask}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
