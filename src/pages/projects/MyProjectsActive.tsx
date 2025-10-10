import { useMemo, useState } from 'react';
import { ProjectsSearch } from '../../components/projects/ProjectsSearch';
import { NewProjectButton } from '../../components/projects/NewProjectButton';
import { ProjectsGrid } from '../../components/projects/ProjectsGrid';
import ProjectCreateWizard from '../../features/projects/new/ProjectCreateWizard';
import type { Member, ProjectSummary } from '../../components/projects/projectTypes';
import { useToast } from '../../components/ui/toast';

function useMockMembers(): Member[] {
  return useMemo(() => {
    const BASE = (import.meta as any).env?.BASE_URL ?? '/';
    const names = ['Alex', 'Sam', 'Taylor', 'Riley', 'Jordan', 'Casey', 'Jamie', 'Morgan'];
    return names.map((name, i) => ({
      id: `u${i + 1}`,
      name,
      avatarUrl: `${BASE}users_profile/u${(i % 8) + 1}.jpg`,
    }));
  }, []);
}

function makeProject(id: number, members: Member[], overrides: Partial<ProjectSummary> = {}): ProjectSummary {
  const titles = ['Box Application - 1', 'Box Application - 2', 'Box Application - 3'];
  const title = titles[id % titles.length];
  const summary = 'Redesigning a finance app with a focus on UI design can greatly enhance user';
  const phases = id % 2 === 0 ? ['IQ', 'FRS'] : ['URS', 'FRS', 'IQ'];
  const base: ProjectSummary = {
    id: `p_${id}`,
    title,
    summary,
    status: id % 3 === 0 ? 'completed' : id % 3 === 1 ? 'in-progress' : 'hold',
    priority: id % 2 === 0 ? 'high' : 'low',
    startDate: 'Thu, 14 Feb',
    endDate: 'Mon, 28 Feb',
    phases,
    progressPct: 80,
    members: members.slice(0, 5),
    stats: { comments: 12, tasks: 7, attachments: 2 },
  };
  return { ...base, ...overrides };
}

export default function MyProjectsActive() {
  const members = useMockMembers();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ProjectSummary[]>(() => Array.from({ length: 6 }).map((_, i) => makeProject(i + 1, members)));
  const [loading] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => (it.title + ' ' + it.summary).toLowerCase().includes(q));
  }, [items, query]);

  function onOpenProject(id: string) {
    // integrate route later: navigate(`/project/${id}`)
    console.log('open project', id);
  }

  function onCreateProject() {
    // Open the Create New Project wizard modal instead of inserting a card
    setWizardOpen(true);
  }

  const { showToast, Toast } = useToast();

  function onWizardComplete() {
    try {
      // Create a new project with mock data (replace with actual form data when available)
      const newProject = makeProject(items.length + 1, members, {
        id: `p_${Date.now()}`,
        title: 'New Project',
        summary: 'Project created from the wizard',
        status: 'in-progress',
        progressPct: 0,
        startDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        members: members.slice(0, 2), // Assign first 2 members by default
      });

      // Add the new project to the beginning of the list
      setItems(prevItems => [newProject, ...prevItems]);
      
      // Highlight the new project
      setHighlightId(newProject.id);
      
      // Show success toast
      showToast('Your project was created successfully!');
      
      // Remove highlight after animation completes
      setTimeout(() => setHighlightId(null), 2000);
      
      // Close the wizard
      setWizardOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      showToast('Failed to create project. Please try again.', 5000);
    }
  }

  return (
    <section className="grid gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <ProjectsSearch value={query} onChange={setQuery} />
        <NewProjectButton onCreate={onCreateProject} />
      </div>

      {/* Grid */}
      <ProjectsGrid
        items={filtered}
        loading={loading}
        onOpenProject={onOpenProject}
        highlightId={highlightId || undefined}
      />

      {/* Create New Project Modal */}
      <ProjectCreateWizard open={wizardOpen} onOpenChange={setWizardOpen} onComplete={onWizardComplete} />
      
      {/* Toast Notifications */}
      <Toast />
    </section>
  );
}
