import { useTheme } from './ThemeProvider'

export function ProjectSidebar() {
  const projects = [
    { id: '1', name: 'Aurelia Chantria', tasks: 12, color: 'bg-red-500' },
    { id: '2', name: 'Aurelia Chantria', tasks: 12, color: 'bg-rose-400' },
    { id: '3', name: 'HPLC System', tasks: 12, color: 'bg-emerald-500' },
    { id: '4', name: 'Box Application', tasks: 12, color: 'bg-sky-500' },
    { id: '5', name: 'Microscope', tasks: 12, color: 'bg-yellow-500' },
  ]

  const { theme, toggle } = useTheme()

  return (
    <div className="w-[280px] md:w-[300px] lg:w-[320px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-3">
      <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-[hsl(var(--bg))] px-3 py-2">
        <h2 className="text-sm font-medium">My Projects</h2>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-[hsl(var(--border))] px-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Toggle theme"
        >
          <span aria-hidden>{theme === 'light' ? '🌞' : '🌜'}</span>
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {projects.map((p, idx) => (
          <li key={p.id}>
            <button
              type="button"
              className={
                'flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left hover:border-[hsl(var(--border))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2' +
                (idx === 0 ? ' bg-blue-600/10' : '')
              }
              aria-current={idx === 0 ? 'page' : undefined}
            >
              <span className={`h-3 w-3 rounded-full ${p.color}`} aria-hidden />
              <span className="flex-1 text-sm font-medium">{p.name}</span>
              <span className="text-xs opacity-70">{p.tasks} Tasks</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectSidebar
