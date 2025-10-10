export type Member = { id: string; name: string; avatarUrl?: string };

export type ProjectSummary = {
  id: string;
  title: string;
  summary: string;
  status: 'completed' | 'in-progress' | 'hold';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  phases: string[]; // e.g., ["IQ","FRS"]
  progressPct?: number; // optional
  members: Member[];
  stats: { comments: number; tasks: number; attachments: number };
};
