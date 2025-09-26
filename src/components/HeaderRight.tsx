import { Bell, User } from 'lucide-react'
import { cn } from './ui/utils'

interface HeaderRightProps {
  hasUnreadNotifications?: boolean
  className?: string
}

export function HeaderRight({ hasUnreadNotifications = true, className }: HeaderRightProps) {
  const baseButtonClass =
    'relative flex h-8 w-8 items-center justify-center text-white transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer'

  return (
    <nav className={cn('flex items-center gap-4 text-white', className)}>
      <button type="button" aria-label="AI Menu" className={baseButtonClass}>
        <div className="grid h-6 w-6 grid-cols-3 grid-rows-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, idx) => {
            if (idx === 4) {
              return (
                <span
                  key={idx}
                  className="flex items-center justify-center text-[10px] font-semibold tracking-[0.12em]"
                >
                  AI
                </span>
              )
            }

            return <span key={idx} className="h-1.5 w-1.5 rounded-full bg-white" />
          })}
        </div>
      </button>

      <button type="button" aria-label="Notifications" className={baseButtonClass}>
        <Bell className="h-5 w-5" />
        {hasUnreadNotifications && (
          <span className="absolute right-0 top-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      <button
        type="button"
        aria-label="Profile"
        className={cn(baseButtonClass, 'rounded-full border-2 border-white')}
      >
        <User className="h-5 w-5" />
      </button>
    </nav>
  )
}

export default HeaderRight
