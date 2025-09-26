import { useTheme } from './ThemeProvider'
import { Moon, Sun } from 'lucide-react'

function IconRail() {
  const { theme, toggle } = useTheme()
  
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'my-works', label: 'My Works', icon: '🗂️' },
    { key: 'my-projects', label: 'My Projects', icon: '📁' },
    { key: 'reports', label: 'Reports', icon: '📊' },
    { 
      key: 'theme-toggle', 
      label: 'Toggle theme',
      element: (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent hover:border-[hsl(var(--border))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      )
    }
  ]

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-[72px] flex-col items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-3"
    >
      <div aria-label="Logo" className="mb-2 mt-1 text-base font-semibold">
        X
      </div>
      <ul className="flex flex-1 flex-col items-center gap-2">
        {items.map((it) => (
          <li key={it.key}>
            {it.element || (
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-transparent hover:border-[hsl(var(--border))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label={it.label}
              >
                <span aria-hidden>{it.icon}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default IconRail
export { IconRail }
