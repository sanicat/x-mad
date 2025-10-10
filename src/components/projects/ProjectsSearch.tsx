import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

export function ProjectsSearch({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [inner, setInner] = useState(value);

  useEffect(() => setInner(value), [value]);

  // simple debounce
  useEffect(() => {
    const id = setTimeout(() => {
      if (inner !== value) onChange(inner);
    }, 250);
    return () => clearTimeout(id);
  }, [inner, onChange, value]);

  return (
    <div className="w-full max-w-sm">
      <Input
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        aria-label="Search projects"
      />
    </div>
  );
}
