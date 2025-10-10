import { useMemo, useRef, useState, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectHeader from '../../components/project/ProjectHeader'
import ViewSwitcher, { type ViewKey } from '../../components/project/ViewSwitcher'
import BoardView from '../../components/project/board/BoardView'
import ListView from '../../components/project/list/ListView'
import CalendarView from '../../components/project/calendar/CalendarView'
import CommentsView from '../../components/project/comments/CommentsView'
import type { Member, Project, Task } from '../../components/project/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/button'

export default function ProjectDetails() {
  const { id = 'p1' } = useParams()
  const [params, setParams] = useSearchParams()

  const view = (params.get('view') as ViewKey) || 'board'
  const [activeTab, setActiveTab] = useState<'tasks' | 'comments' | 'incident'>('tasks')

  // mock data
  const members: Member[] = useMemo(() => {
    const BASE = (import.meta as any).env?.BASE_URL ?? '/'
    const base: Member[] = [
      { id: 'u1', name: 'Alex' },
      { id: 'u2', name: 'Sam' },
      { id: 'u3', name: 'Taylor' },
      { id: 'u4', name: 'Riley' },
      { id: 'u5', name: 'Jordan' },
    ]
    const pool = ['u1','u2','u3','u4','u5','u6','u7','u8']
    const offset = Math.floor(Math.random() * pool.length)
    return base.map((m, idx) => ({
      ...m,
      avatarUrl: `${BASE}users_profile/${pool[(idx + offset) % pool.length]}.jpg`,
    }))
  }, [])

  const project: Project = useMemo(
    () => ({ id, title: 'Autoclave', dueDate: '3 Sep, 2027', progressPct: 75, members }),
    [id, members],
  )

  const tasks: Task[] = useMemo(() => {
    function sample(n: number) {
      const copy = [...members]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy.slice(0, n)
    }

    let id = 1
    const nextId = () => `t${id++}`
    const make = (stage: Task['stage'], title: string, body: string, label: NonNullable<Task['label']>, extra: Partial<Task> = {}) => ({
      id: nextId(),
      stage,
      title,
      body,
      dueDate: '3 Sep, 2025',
      warnings: Math.random() > 0.7 ? 1 : 0,
      comments: Math.floor(Math.random() * 5),
      attachments: Math.floor(Math.random() * 3),
      assignees: sample(3),
      label,
      labelDaysLeft: Math.floor(Math.random() * 30),
      ...extra,
    }) as Task

    return [
      // URS
      make('URS', 'Gather user requirements', 'Interview stakeholders and capture user needs.', 'Creation'),
      make('URS', 'Draft URS document', 'Structure URS with functional and non-functional needs.', 'Verification'),

      // FRS
      make('FRS', 'Define system features', 'Translate URS into detailed functional specs.', 'Execution'),
      make('FRS', 'FRS review meeting', 'Walkthrough of FRS with engineering and QA.', 'Signoff'),

      // DQ
      make('DQ', 'Design qualification plan', 'Prepare DQ test cases and acceptance criteria.', 'Verification'),
      make('DQ', 'Architecture diagram', 'Document components, interfaces, and data flows.', 'Execution'),

      // IQ
      make('IQ', 'Installation checklist', 'List all installation prerequisites and steps.', 'Execution'),
      make('IQ', 'Environment validation', 'Validate installed components and versions.', 'Verification'),

      // PQ
      make('PQ', 'Performance baselining', 'Establish baseline metrics for throughput/latency.', 'Execution'),
      make('PQ', 'Load test suite', 'Configure and run load tests for peak conditions.', 'Verification'),

      // OQ
      make('OQ', 'Operational procedures', 'Draft runbooks, SOPs, and escalation paths.', 'Execution'),
      make('OQ', 'OQ signoff', 'Approve operational readiness checklist.', 'Signoff'),

      // Execution
      make('Execution', 'Implement module A', 'Code and unit test core business logic.', 'Execution'),
      make('Execution', 'Integrate API', 'Wire up third-party API and handle errors.', 'Execution'),

      // Signoff
      make('Signoff', 'Stakeholder approval', 'Get final acceptance from business owners.', 'Signoff'),
      make('Signoff', 'Compliance review', 'Ensure documentation and audits are complete.', 'Signoff'),

      // Verification
      make('Verification', 'UAT test cycle', 'Execute UAT scripts and collect feedback.', 'Verification'),
      make('Verification', 'Bug triage', 'Review and prioritize findings from UAT.', 'Verification'),

      // Completed
      make('Completed', 'Release notes published', 'Publish release notes and deployment summary.', 'Completed'),
      make('Completed', 'Project retrospective', 'Hold retro and capture action items.', 'Completed'),
    ]
  }, [members])

  function onChangeView(v: ViewKey) {
    const next = new URLSearchParams(params)
    next.set('view', v)
    setParams(next, { replace: true })
  }

  function onOpenTask(id: string) {
    console.log('open task', id)
  }

  const boardRef = useRef<HTMLDivElement | null>(null)
  // Paging state for BoardView
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const canPrev = page > 0
  const canNext = page < totalPages - 1
  function goPrev() {
    if (canPrev) setPage((p) => Math.max(0, p - 1))
  }
  function goNext() {
    if (canNext) setPage((p) => Math.min(totalPages - 1, p + 1))
  }

  // Stable callback to avoid re-creating a new function each render which
  // can cause BoardView's effect to fire and set state on every render
  const handlePageInfo = useCallback(({ current, total }: { current: number; total: number }) => {
    setPage(current)
    setTotalPages(total)
  }, [])

  return (
    <div className="grid gap-4 overflow-x-hidden">
      <ProjectHeader project={project} activeTab={activeTab} onTabChange={setActiveTab} showTabs={false} />

      {/* Unified control bar: Tabs (left) + PagerToolbar + View switcher (right) */}
      <div className="flex items-center justify-between rounded-lg bg-[hsl(var(--surface))] p-2 text-[hsl(var(--fg))]">
        <div role="tablist" aria-label="Project sections" className="inline-flex items-center gap-2">
          {([
            { key: 'tasks', label: 'Tasks' },
            { key: 'comments', label: 'Comments' },
            { key: 'incident', label: 'Incident' },
          ] as const).map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              aria-controls={`panel-${t.key}`}
              onClick={() => setActiveTab(t.key)}
              className={[
                'rounded-full border px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 border-b-2',
                activeTab === t.key
                  ? 'bg-[#1f3a9d] text-white border-transparent border-b-[#1f3a9d]'
                  : 'bg-[hsl(var(--surface))] text-[hsl(var(--fg))] border-[hsl(var(--border))] hover:bg-[hsl(var(--surface-muted))] border-b-transparent',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {/* PagerToolbar (before ViewSwitcher) */}
          <div className="inline-flex items-center gap-1" aria-label="Board page controls">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              className="focus-visible:ring-[#1f3a9d]"
              onClick={goPrev}
              disabled={!canPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
              className="focus-visible:ring-[#1f3a9d]"
              onClick={goNext}
              disabled={!canNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {activeTab === 'tasks' && (
            <ViewSwitcher value={view} onChange={onChangeView} />
          )}
        </div>
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {activeTab === 'tasks' && (
          <>
            {view === 'board' && (
              <BoardView
                tasks={tasks}
                onOpenTask={onOpenTask}
                outerRef={(el: HTMLDivElement | null) => {
                  boardRef.current = el;
                }}
                externalPage={page}
                onPageInfo={handlePageInfo}
              />
            )}
            {view === 'list' && <ListView tasks={tasks} onOpenTask={onOpenTask} />}
            {view === 'calendar' && <CalendarView tasks={tasks} onOpenTask={onOpenTask} />}
          </>
        )}
        {activeTab === 'comments' && <CommentsView />}
        {activeTab === 'incident' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Incident</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Incident details will be displayed here.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
