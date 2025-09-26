import { Card, CardContent, CardHeader } from '../ui/card'

interface TaskCardProps {
  title: string
  desc: string
  due?: string
}

export function TaskCard({ title, desc, due }: TaskCardProps) {
  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-medium">{title}</h4>
          <button aria-label="More" className="text-lg opacity-60">
            ⋯
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-xs opacity-80">{desc}</p>
        {due && (
          <div className="mt-3 text-right text-xs">
            <button className="underline-offset-2 hover:underline">Due date: {due}</button>
          </div>
        )}
        <div className="mt-2 flex items-center gap-4 text-xs opacity-80">
          <span aria-label="alerts">△ 2</span>
          <span aria-label="comments">💬 0</span>
          <span aria-label="attachments">📎 2</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskCard
