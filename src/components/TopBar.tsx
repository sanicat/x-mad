import { Input } from './ui/input'
import { Button } from './ui/button'
import { useTheme } from './ThemeProvider'

export function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg))] p-3">
      {/* Search */}
      <div className="flex-1">
        <label htmlFor="global-search" className="sr-only">
          Search
        </label>
        <Input id="global-search" type="search" placeholder="Search" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="AI Assistant">
          <span aria-hidden>✨</span>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <span aria-hidden>🔔</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-pressed={theme === 'dark'}
        >
          <span aria-hidden>{theme === 'light' ? '🌞' : '🌙'}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Profile"
          className="rounded-full border-[hsl(var(--border))]"
        >
          <span className="text-xs" aria-hidden>
            😊
          </span>
        </Button>
      </div>
    </div>
  )
}

export default TopBar
