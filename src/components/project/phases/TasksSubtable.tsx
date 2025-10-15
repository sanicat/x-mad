import { Calendar, Edit, Eye, MessageCircle, Paperclip, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Task } from '../types'
import RelativeTime from '../utils/RelativeTime'
import IconActionButton from '../utils/IconActionButton'

export interface TasksSubtableProps {
  tasks: Task[]
  phaseId: string
  onOpenTask: (id: string) => void
  onEditTask: (id: string) => void
  onAddTask: (phaseId: string) => void
}

const labelStyles: Record<NonNullable<Task['label']>, string> = {
  Creation: 'bg-blue-100 text-blue-700 border-blue-200',
  Verification: 'bg-purple-100 text-purple-700 border-purple-200',
  Execution: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Signoff: 'bg-teal-100 text-teal-700 border-teal-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
}

export default function TasksSubtable({ tasks, phaseId, onOpenTask, onEditTask, onAddTask }: TasksSubtableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="bg-gray-50/50">
        <div role="table" aria-label="Phase tasks" className="w-full">
          {/* Tasks */}
          {tasks.map((task) => (
            <div
              key={task.id}
              role="row"
              className="grid grid-cols-[auto_1.5fr_1fr_1.5fr_1.5fr_1.5fr_auto] items-center gap-4 border-b border-gray-200 bg-gray-50/30 px-4 py-3 text-sm last:border-b-0 hover:bg-gray-50/50"
            >
              {/* Empty cell to align with caret column */}
              <div role="cell" className="w-6" />

              {/* Title */}
              <div role="cell" className="min-w-0 font-medium text-[hsl(var(--fg))] truncate">
                {task.title}
              </div>

              {/* Status (Label) */}
              <div role="cell" className="flex items-center min-w-0">
                {task.label && (
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${labelStyles[task.label]}`}
                  >
                    {task.label}
                  </span>
                )}
              </div>

              {/* Timeline (Last Updated) */}
              <div role="cell" className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" />
                  </svg>
                </div>
                {task.updatedAt ? (
                  <RelativeTime datetime={task.updatedAt} />
                ) : (
                  <span className="truncate">10 Secs ago</span>
                )}
              </div>

              {/* Assignees */}
              <div role="cell" className="min-w-0">
                <div className="flex items-center gap-2">
                  {task.assignees[0] && (
                    <>
                      <img
                        src={task.assignees[0].avatarUrl || ''}
                        alt=""
                        className="h-6 w-6 rounded-full border-2 border-white object-cover ring-1 ring-gray-200 flex-shrink-0"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="truncate text-sm text-gray-700">
                        {task.assignees[0].name}
                        {task.assignees.length > 1 && ` +${task.assignees.length - 1}`}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div role="cell" className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <time dateTime={task.dueDate} className="truncate">
                  {task.dueDate}
                </time>
              </div>

              {/* Meta (alerts/comments/attachments + actions) */}
              <div role="cell" className="flex items-center gap-2 min-w-0">
                {task.warnings ? (
                  <div className="flex items-center gap-1 text-xs text-orange-600" title={`${task.warnings} warning(s)`}>
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{task.warnings}</span>
                  </div>
                ) : null}
                {task.comments ? (
                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--fg))]/60" title={`${task.comments} comment(s)`}>
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{task.comments}</span>
                  </div>
                ) : null}
                {task.attachments ? (
                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--fg))]/60" title={`${task.attachments} attachment(s)`}>
                    <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{task.attachments}</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-1">
                  <IconActionButton ariaLabel={`Edit ${task.title}`} onClick={() => onEditTask(task.id)} icon={<Edit className="h-4 w-4" />} />
                  <IconActionButton ariaLabel={`View ${task.title}`} onClick={() => onOpenTask(task.id)} icon={<Eye className="h-4 w-4" />} />
                </div>
              </div>
            </div>
          ))}

          {/* Add Task Button */}
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={() => onAddTask(phaseId)}
              className="inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[hsl(var(--fg))]/70 transition-colors hover:border-[#1f3a9d] hover:bg-[#1f3a9d]/5 hover:text-[#1f3a9d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]"
            >
              <span className="text-lg leading-none">+</span>
              Add Task
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
