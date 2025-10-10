import { motion } from 'framer-motion';
import { CalendarDays, MessageSquare, Paperclip, ListChecks, MoreVertical, Tag } from 'lucide-react';
import type { ProjectSummary } from './projectTypes';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { PhasePill } from './PhasePill';
import { AvatarGroup } from './AvatarGroup';
import { ProgressInline } from './ProgressInline';
import { MetaStat } from './MetaStat';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

export function ProjectCard({ item, onOpen, highlight }: { item: ProjectSummary; onOpen: (id: string) => void; highlight?: boolean }) {
  const open = () => onOpen(item.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        borderColor: highlight ? 'rgba(61, 91, 198, 0.3)' : 'rgba(203, 213, 225, 1)'
      }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        borderColor: { duration: 0.3 }
      }}
      className="relative overflow-hidden"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        aria-label={`Open project ${item.title}`}
        className={`relative group w-full max-w-[400px] text-left rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3a9d]`}
        style={highlight ? { backgroundColor: 'rgba(61, 91, 198, 0.1)' } : {}}
      >
        {highlight && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ background: 'radial-gradient(120% 120% at 50% 50%, rgba(31,58,157,0.3), transparent 60%)' }}
          />
        )}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-haspopup="menu" aria-label="Open project menu">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={open}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e?.stopPropagation()}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e?.stopPropagation()} className="text-gray-700">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-4">
            <div className="font-semibold text-gray-900 line-clamp-1">{item.title}</div>
            <PriorityBadge priority={item.priority} />
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.summary}</p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          <span>
            {item.startDate} - {item.endDate}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-gray-400" aria-hidden />
          {item.phases.map((p) => (
            <PhasePill key={p} code={p} />
          ))}
        </div>

        {typeof item.progressPct === 'number' && (
          <div className="mt-3">
            <ProgressInline value={item.progressPct} />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <AvatarGroup members={item.members} />
          <div className="flex items-center gap-4">
            <MetaStat icon={<MessageSquare className="h-4 w-4" />} count={item.stats.comments} ariaLabel="Comments" />
            <MetaStat icon={<ListChecks className="h-4 w-4" />} count={item.stats.tasks} ariaLabel="Tasks" />
            <MetaStat icon={<Paperclip className="h-4 w-4" />} count={item.stats.attachments} ariaLabel="Attachments" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
