import type { ReactNode } from 'react'
import Header from './Header'

interface AppShellProps {
  iconRail?: ReactNode
  sidebar?: ReactNode
  topbar?: ReactNode
  children: ReactNode
}

// Non-intrusive app shell. Does not modify global styles; purely local layout.
export function AppShell({ iconRail, sidebar, topbar, children }: AppShellProps) {
  return (
    <div className="min-h-dvh w-full bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <Header />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Bar */}
        {topbar && (
          <div className="sticky top-16 z-10 mb-4 bg-[hsl(var(--bg))]">
            {topbar}
          </div>
        )}

        {/* Main 3-column frame: icon rail | sidebar | content */}
        <div className="grid grid-cols-[auto_auto_1fr] gap-4">
          {/* Icon rail: hidden on small screens; can be moved to a Sheet later */}
          <aside aria-label="Primary navigation" className="hidden sm:block">
            {iconRail}
          </aside>

          {/* Project sidebar: hidden on small screens; can be toggled later */}
          <aside aria-label="Project list" className="hidden md:block">
            {sidebar}
          </aside>

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AppShell
