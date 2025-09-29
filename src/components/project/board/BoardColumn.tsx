import { useEffect, useMemo, useRef, useState } from 'react'
import { Layers, ClipboardList, Beaker, Cog, Wrench, Workflow, FileSignature, Rocket, Gauge } from 'lucide-react'
import TaskCard from '../TaskCard'
import type { Task, StageKey } from '../types'

export interface BoardColumnProps {
  stage: StageKey
  tasks: Task[]
  count?: number
  onOpenTask?: (id: string) => void
  onReorder?: (stage: StageKey, newOrderIds: string[]) => void
}

export default function BoardColumn({ stage, tasks, count, onOpenTask, onReorder }: BoardColumnProps) {
  const [items, setItems] = useState<Task[]>(tasks)
  useEffect(() => {
    setItems(tasks)
  }, [tasks])

  const c = count ?? items.length
  const icons = [Layers, ClipboardList, Beaker, Cog, Wrench, Workflow, FileSignature, Rocket, Gauge]
  // Deterministic pick based on stage name
  const hash = String(stage).split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const Icon = icons[hash % icons.length]

  // a11y ids
  const headerId = useMemo(() => `${String(stage).toLowerCase().replace(/\s+/g, '-')}-label`, [stage])

  // drag state
  const dragIndexRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const liveRef = useRef<HTMLDivElement | null>(null)

  function announce(msg: string) {
    // minimal live region update
    if (liveRef.current) {
      liveRef.current.textContent = msg
    }
  }

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const [spliced] = next.splice(from, 1)
      next.splice(to, 0, spliced)
      return next
    })
    const moved = items[from]
    announce(`Moved ${moved?.title ?? 'item'} to position ${to + 1}`)
  }

  function commitReorder() {
    if (onReorder) onReorder(stage, items.map((t) => t.id))
  }

  return (
    <section className="w-[20rem] flex-shrink-0 snap-start">
      <div className="bg-[hsl(var(--surface))]">
        {/* Header */}
        <div id={headerId} className="flex items-center justify-between bg-[#1f3a9d] px-3.5 py-2.5 text-white rounded-t-lg">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/10">
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-medium">{String(stage)}</span>
          </div>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/10 px-2 text-sm">{c}</span>
        </div>

        {/* Body */}
        <div className="py-3">
          <div
            className="flex flex-col space-y-4"
            role="list"
            aria-labelledby={headerId}
          >
            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[hsl(var(--border))] p-3 text-sm opacity-70">No tasks yet</div>
            ) : (
              items.map((t, idx) => (
                <div
                  key={t.id}
                  role="listitem"
                  tabIndex={0}
                  draggable
                  data-index={idx}
                  aria-grabbed={isDraggingRef.current || undefined}
                  onDragStart={(e) => {
                    dragIndexRef.current = idx
                    isDraggingRef.current = true
                    e.dataTransfer.effectAllowed = 'move'
                    // For Firefox compatibility
                    e.dataTransfer.setData('text/plain', t.id)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    const from = dragIndexRef.current
                    const to = idx
                    if (from == null || from === to) return
                    move(from, to)
                    dragIndexRef.current = to
                  }}
                  onDragEnd={() => {
                    isDraggingRef.current = false
                    dragIndexRef.current = null
                    commitReorder()
                  }}
                  onKeyDown={(e) => {
                    if (!e.altKey) return
                    if (e.key === 'ArrowUp' && idx > 0) {
                      e.preventDefault()
                      move(idx, idx - 1)
                      commitReorder()
                    } else if (e.key === 'ArrowDown' && idx < items.length - 1) {
                      e.preventDefault()
                      move(idx, idx + 1)
                      commitReorder()
                    }
                  }}
                  className="outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]"
                >
                  <TaskCard task={t} onOpen={onOpenTask} />
                </div>
              ))
            )}
            {/* aria-live region for reordering announcements */}
            <div aria-live="polite" className="sr-only" ref={liveRef} />
          </div>
        </div>
      </div>
    </section>
  )
}

