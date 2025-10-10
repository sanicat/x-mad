import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import type { Equipment } from '../types'

interface EquipmentChipsProps {
  items: Equipment[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export const EquipmentChips = motion(function EquipmentChips({
  items,
  selectedIds,
  onToggle,
}: EquipmentChipsProps) {
  return (
    <motion.div 
      className="mt-3 flex flex-wrap gap-2" 
      role="listbox" 
      aria-label="Equipment results"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {items.map(item => {
        const selected = selectedIds.includes(item.id)
        return (
          <motion.button
            key={item.id}
            role="checkbox"
            aria-checked={selected}
            onClick={() => onToggle(item.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(item.id) } }}
            className={[
              'group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58A942]',
              selected 
                ? 'border-2 border-[#58A942] bg-white text-[#58A942]' 
                : 'border border-gray-300 bg-white text-gray-700 hover:border-[#58A942]/50 hover:shadow-sm',
            ].join(' ')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">{item.name}</span>
            <AnimatePresence>
              {selected && (
                <motion.span 
                  className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#58A942]/10"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Check size={12} strokeWidth={3} className="text-[#58A942]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </motion.div>
  )
})
