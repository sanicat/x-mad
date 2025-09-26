import AppShell from '../components/AppShell'
import IconRail from '../components/IconRail'
import ProjectSidebar from '../components/ProjectSidebar'
import TopBar from '../components/TopBar'
import { ProjectSummaryCard } from '../components/ProjectSummaryCard'
import { ViewSwitcher } from '../components/ViewSwitcher'
import { BoardColumn } from '../components/board/BoardColumn'

export default function Dashboard() {
  const columns = [
    {
      id: 'urs',
      title: 'URS',
      count: 2,
      tasks: [
        { id: 't1', title: 'Develop First Website', desc: 'Essential steps about the importance of research and key steps to successfully create a professional and effective web...', due: '3 Sep, 2025' },
        { id: 't2', title: 'Redesign Finance App', desc: 'Redesigning a finance app with a focus on UI design can greatly enhance user experience and satisfaction.', due: '3 Sep, 2025' },
      ],
    },
    {
      id: 'frs',
      title: 'FRS',
      count: 1,
      tasks: [
        { id: 't3', title: 'Branding & New Logo', desc: 'Creating a strong brand identity through effective marketing strategies can help your business stand out.', due: '3 Sep, 2025' },
      ],
    },
    {
      id: 'dq',
      title: 'DQ',
      count: 2,
      tasks: [
        { id: 't4', title: 'Wireframe Landing Page', desc: 'Creating an effective wireframe landing page for your website is essential for a successful online presence.', due: '3 Sep, 2025' },
        { id: 't5', title: 'Dashboard Parking Web', desc: 'Creating a visually appealing and user-friendly UI design for your Dashboard Parking web app is crucial.', due: '3 Sep, 2025' },
      ],
    },
  ]

  return (
    <AppShell iconRail={<IconRail />} sidebar={<ProjectSidebar />} topbar={<TopBar />}>
      <ProjectSummaryCard
        title="Autoclave (3 Days left)"
        dueLabel="Due date: 3 Sep, 2027"
        progress={75}
        avatars={[{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }, { id: 'u4' }]}
        overflowCount={5}
        className="mb-4"
      />

      <ViewSwitcher className="mb-4" />

      <section aria-label="Board" className="overflow-x-auto">
        <div className="flex min-w-full gap-4">
          {columns.map((c) => (
            <BoardColumn key={c.id} title={c.title} count={c.count} tasks={c.tasks} />
          ))}
        </div>
      </section>
    </AppShell>
  )
}
