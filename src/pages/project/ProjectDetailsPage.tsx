import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ProjectDetailsHeader from '../../components/project/header/ProjectDetailsHeader'
import PhasesTable from '../../components/project/phases/PhasesTable'
import type { Member, Project, Phase, Task, PhaseStatus } from '../../components/project/types'

export default function ProjectDetailsPage() {
  const { id = 'p1' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const expandedParam = searchParams.get('expanded')

  // Mock data
  const members: Member[] = useMemo(() => {
    const BASE = (import.meta as any).env?.BASE_URL ?? '/'
    const base: Member[] = [
      { id: 'u1', name: 'Madhava' },
      { id: 'u2', name: 'Rajesh Khanna' },
      { id: 'u3', name: 'Taylor' },
      { id: 'u4', name: 'Riley' },
      { id: 'u5', name: 'Jordan' },
      { id: 'u6', name: 'Alex' },
      { id: 'u7', name: 'Sam' },
    ]
    const pool = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8']
    const offset = Math.floor(Math.random() * pool.length)
    return base.map((m, idx) => ({
      ...m,
      avatarUrl: `${BASE}users_profile/${pool[(idx + offset) % pool.length]}.jpg`,
    }))
  }, [])

  const project: Project = useMemo(
    () => ({
      id,
      title: 'Autoclave',
      dueDate: '3 Sep, 2027',
      progressPct: 75,
      members,
      daysLeft: 3,
    }),
    [id, members]
  )

  const phases: Phase[] = useMemo(() => {
    function sample(arr: Member[], n: number): Member[] {
      const copy = [...arr]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy.slice(0, n)
    }

    const now = Date.now()
    const makeDate = (offsetSeconds: number) => new Date(now - offsetSeconds * 1000)

    const phaseData: Array<{
      name: Phase['name']
      status: PhaseStatus
      offsetSeconds: number
      dueDate: string
      tasks: Array<{ title: string; label: Task['label']; assignee: string }>
    }> = [
      {
        name: 'URS',
        status: 'In-Progress',
        offsetSeconds: 10,
        dueDate: '10-09-2025',
        tasks: [
          { title: 'Creation', label: 'Completed', assignee: 'Rajesh Khanna' },
          { title: 'Verification', label: 'Completed', assignee: 'Rajesh Khanna' },
          { title: 'Signoff', label: 'Completed', assignee: 'Rajesh Khanna' },
          { title: 'Execution', label: 'Completed', assignee: 'Rajesh Khanna' },
        ],
      },
      {
        name: 'FRS',
        status: 'Completed',
        offsetSeconds: 18 * 60,
        dueDate: '10-09-2025',
        tasks: [],
      },
      {
        name: 'DQ',
        status: 'Not Started',
        offsetSeconds: 2 * 60 * 60,
        dueDate: '10-09-2025',
        tasks: [],
      },
      {
        name: 'IQ',
        status: 'Completed',
        offsetSeconds: 2 * 30 * 24 * 60 * 60,
        dueDate: '02-07-2025',
        tasks: [],
      },
      {
        name: 'PQ',
        status: 'Working on',
        offsetSeconds: 3 * 365 * 24 * 60 * 60,
        dueDate: '22-02-2022',
        tasks: [],
      },
      {
        name: 'OQ',
        status: 'Completed',
        offsetSeconds: 4 * 365 * 24 * 60 * 60,
        dueDate: '15-09-2021',
        tasks: [],
      },
    ]

    return phaseData.map((p, idx) => ({
      id: `phase-${idx + 1}`,
      name: p.name,
      status: p.status,
      updatedAt: makeDate(p.offsetSeconds),
      assignees: sample(members, 3),
      lead: members[0],
      dueDate: p.dueDate,
      tasks: p.tasks.map((t, tidx) => ({
        id: `task-${idx}-${tidx}`,
        stage: p.name,
        title: t.title,
        body: '',
        dueDate: p.dueDate,
        warnings: Math.random() > 0.7 ? 1 : 0,
        comments: Math.floor(Math.random() * 5),
        attachments: Math.floor(Math.random() * 3),
        assignees: [members.find((m) => m.name === t.assignee) || members[0]],
        label: t.label,
        labelDaysLeft: 0,
        updatedAt: makeDate(p.offsetSeconds + tidx * 10),
      })),
    }))
  }, [members])

  const handleExpandedChange = (expanded: string[]) => {
    const params = new URLSearchParams(searchParams)
    if (expanded.length > 0) {
      // Map phase IDs to phase names
      const names = expanded
        .map((id) => phases.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join(',')
      params.set('expanded', names)
    } else {
      params.delete('expanded')
    }
    setSearchParams(params, { replace: true })
  }

  const handleOpenTask = (taskId: string) => {
    console.log('Open task:', taskId)
  }

  const handleEditTask = (taskId: string) => {
    console.log('Edit task:', taskId)
  }

  const handleEditPhase = (phaseId: string) => {
    console.log('Edit phase:', phaseId)
  }

  const handleViewPhase = (phaseId: string) => {
    console.log('View phase:', phaseId)
  }

  const handleAddTask = (phaseId: string) => {
    console.log('Add task to phase:', phaseId)
  }

  // Convert phase names from URL to IDs
  const expandedIds = useMemo(() => {
    if (!expandedParam) return []
    const names = expandedParam.split(',')
    return phases.filter((p) => names.includes(p.name)).map((p) => p.id)
  }, [expandedParam, phases])

  return (
    <div className="grid gap-4">
      <ProjectDetailsHeader project={project} />
      <PhasesTable
        phases={phases}
        initialExpanded={expandedIds}
        onOpenTask={handleOpenTask}
        onEditTask={handleEditTask}
        onEditPhase={handleEditPhase}
        onViewPhase={handleViewPhase}
        onAddTask={handleAddTask}
        onExpandedChange={handleExpandedChange}
      />
    </div>
  )
}
