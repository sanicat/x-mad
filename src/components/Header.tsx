import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { Input } from './ui/input'
import { cn } from './ui/utils'
import HeaderRight from './HeaderRight'

interface HeaderProps {
  className?: string
  hasUnreadNotifications?: boolean
}

export default function Header({ className, hasUnreadNotifications = true }: HeaderProps) {
  return (
    <motion.header
      className={cn(
        'sticky top-0 z-40 h-16 w-full bg-blue-800 shadow-sm',
        className,
      )}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="X-MED" className="h-8 w-auto" />
          <span className="text-lg font-bold text-white">X-MED</span>
        </div>

        {/* Search */}
        <div className="flex flex-1 justify-center px-4">
          <div className="w-full max-w-[420px] flex-1 sm:max-w-[320px] md:max-w-[360px] lg:max-w-[420px]">
            <Input
              type="search"
              placeholder="Search"
              className="h-10 w-full rounded-full border-none bg-white px-4 text-sm text-gray-700 shadow-sm focus-visible:ring-2 focus-visible:ring-white/80"
            />
          </div>
        </div>

        <HeaderRight hasUnreadNotifications={hasUnreadNotifications} />
      </div>
    </motion.header>
  )
}
