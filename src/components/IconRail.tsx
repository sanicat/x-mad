import { NavLink } from 'react-router-dom'
import { useTheme } from './useTheme'
import { LayoutGrid, FolderClosed, CalendarDays, BarChart3, Settings, LogOut, Sun, Moon } from 'lucide-react'

function IconRail() {
  const { theme, toggle } = useTheme()

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
    { key: 'works', label: 'My Works', to: '/works', icon: FolderClosed },
    { key: 'projects', label: 'My Projects', to: '/projects/active', icon: CalendarDays },
    { key: 'reports', label: 'Reports', to: '/reports', icon: BarChart3 },
    { key: 'settings', label: 'Settings', to: '/settings', icon: Settings },
  ]

  return (
    <nav
      aria-label="Primary"
      className="relative flex h-full w-[75px] flex-col rounded-none border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-1 shadow-[4px_0_12px_rgba(0,0,0,0.08)]"
    >
      <ul className="mt-4 flex flex-1 flex-col gap-2">
        {navItems.map(({ key, label, to, icon: Icon }) => (
          <li key={key}>
            <NavLink
              to={to}
              end={key === 'works'} // Add end prop for 'works' to match exact path
              className={({ isActive }) =>
                [
                  'neon-card group flex h-[65px] w-full flex-col items-center justify-center gap-[4px] rounded-xl px-2 py-2 text-[10px] leading-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-[hsl(var(--fg))] hover:bg-brand/10 hover:text-brand',
                ].join(' ')
              }
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-center text-[10px] leading-[11px]">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-3">
        {/* Vertical theme toggle capsule */}
        <button
          type="button"
          onClick={toggle}
          className="mx-auto flex h-24 w-12 flex-col items-center justify-center rounded-full border border-brand/60 text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          aria-label="Toggle theme"
          aria-pressed={theme === 'dark'}
        >
          <Sun className={['mb-2 h-5 w-5', theme === 'light' ? 'text-brand' : 'text-brand/30'].join(' ')} />
          <Moon className={['mt-2 h-5 w-5', theme === 'dark' ? 'text-brand' : 'text-brand/30'].join(' ')} />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={() => console.log('logout clicked')}
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}

export default IconRail
export { IconRail }
