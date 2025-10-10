import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

export function NewProjectButton({ onCreate }: { onCreate: () => void }) {
  return (
    <Button className="bg-[#1f3a9d] hover:bg-[#19307d]" onClick={onCreate} aria-label="Create new project">
      <Plus className="h-4 w-4 mr-2" />
      New Project
    </Button>
  );
}
