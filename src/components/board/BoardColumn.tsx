import { Card, CardContent, CardHeader } from '../ui/card'
import Badge from '../ui/badge'
import { TaskCard } from './TaskCard'

interface TaskLite {
  id: string
  title: string
  desc: string
  due?: string
}

interface BoardColumnProps {
  title: string
  count: number
  tasks: TaskLite[]
}

export function BoardColumn({ title, count, tasks }: BoardColumnProps) {
  return (
    <Card className="min-w-[320px] sm:min-w-[360px] md:min-w-[380px] lg:min-w-[400px]">
      <CardHeader className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span aria-hidden>🗂️</span>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <Badge>{count}</Badge>
      </CardHeader>
      <CardContent>
        {tasks.map((t) => (
          <TaskCard key={t.id} title={t.title} desc={t.desc} due={t.due} />
        ))}
      </CardContent>
    </Card>
  )
}

export default BoardColumn
