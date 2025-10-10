import { useMemo } from 'react'
import { CheckCircle } from 'lucide-react'
import { useProjectDraft } from '../useProjectDraft'
import { FileDropZone } from '../upload/FileDropZone'
import { useUploader } from '../upload/useUploader'
import { UploadQueue } from '../upload/UploadQueue'

export type Assignee = { id: string; name: string; role: string; avatarUrl?: string }

function useMockAssignees(): Assignee[] {
  return useMemo(() => {
    const BASE = (import.meta as any).env?.BASE_URL ?? '/'
    const names: Array<[string,string]> = [
      ['Florencio Dorrance','Senior Developer'],
      ['Aarti Singh','Assistant Backend Developer'],
      ['Sameer Patel','Business Executive'],
      ['Neha Bhatia','UX Designer'],
      ['Shreya Joshi','Customer Service Manager'],
      ['Kavita Rajput','Front End Developer'],
      ['Vikram Malhotra','Front End Developer'],
      ['Sameer Patel','Assistant Backend Developer'],
    ]
    return names.map((n, i) => ({ id: `a${i+1}`, name: n[0], role: n[1], avatarUrl: `${BASE}users_profile/u${(i%8)+1}.jpg` }))
  }, [])
}

function AssigneeItem({ a, selected, onToggle }: { a: Assignee; selected: boolean; onToggle: (id: string) => void }) {
  return (
    <div
      role="option"
      aria-selected={selected}
      tabIndex={0}
      onClick={() => onToggle(a.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(a.id) } }}
      className={[
        'flex cursor-pointer items-center justify-between rounded-lg px-4 h-[48px] transition-colors',
        selected ? 'bg-[#1f3a9d]/10' : 'hover:bg-black/5',
      ].join(' ')}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative h-8 w-8">
          {selected ? (
            <div className="grid h-8 w-8 place-items-center">
              <CheckCircle className="h-6 w-6 text-[#1f3a9d] transition-opacity duration-200" aria-hidden />
            </div>
          ) : (
            <img
              src={a.avatarUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover transition-opacity duration-200"
            />
          )}
        </div>
        <div>
          <div className="text-[12px] font-semibold text-[#111827] leading-tight">{a.name}</div>
          <div className="text-[11px] text-[#6B7280] leading-tight">{a.role}</div>
        </div>
      </div>
      <span className="h-5 w-5" aria-hidden />
    </div>
  )
}

function AssigneeList({ items, selectedIds, onToggle }: { items: Assignee[]; selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <div role="listbox" aria-multiselectable="true" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map(a => (
        <AssigneeItem key={a.id} a={a} selected={selectedIds.includes(a.id)} onToggle={onToggle} />
      ))}
    </div>
  )
}

export default function Step3AssignUpload() {
  const { draft, toggleAssignee } = useProjectDraft()
  const assignees = useMockAssignees()

  const uploader = useUploader({ maxFiles: 10, maxSizeMB: 50, accept: ['application/pdf','image/*','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'] })

  return (
    <div className="grid gap-6">
      {/* Assign to project */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Assign to project</h3>
        <AssigneeList items={assignees} selectedIds={draft.assigneeIds} onToggle={toggleAssignee} />
      </section>

      {/* Required Phases - Upload */}
      <section>
        <h3 className="mb-3 text-sm font-medium">Required Phases</h3>
        <FileDropZone onFiles={(files: File[]) => uploader.addFiles(files)} disabled={uploader.isFull} helperId="upload-help" />
        <p id="upload-help" className="sr-only">Drag and drop to upload files or browse using the file picker</p>
        {uploader.queue.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-gray-700">Uploaded Files</div>
            <UploadQueue uploader={uploader} />
          </div>
        )}
      </section>
    </div>
  )
}
