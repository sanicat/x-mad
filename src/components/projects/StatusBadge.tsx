type Status = 'completed' | 'in-progress' | 'hold';

export function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    'completed': { text: 'Completed', bg: 'bg-green-100', fg: 'text-green-700', ring: 'ring-green-300' },
    'in-progress': { text: 'In-Progress', bg: 'bg-yellow-100', fg: 'text-yellow-800', ring: 'ring-yellow-300' },
    'hold': { text: 'Hold', bg: 'bg-gray-100', fg: 'text-gray-700', ring: 'ring-gray-300' },
  }[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.fg} ring-1 ring-inset ${cfg.ring}`}>
      {cfg.text}
    </span>
  );
}
