import { useCallback, useMemo, useRef, useState } from 'react'

export type UploadItem = {
  id: string
  file: File
  status: 'queued' | 'uploading' | 'done' | 'error'
  progress: number
  eta?: string
  error?: string
}

export function useUploader(opts?: { maxFiles?: number; maxSizeMB?: number; accept?: string[]; autoStart?: boolean }) {
  const maxFiles = opts?.maxFiles ?? 10
  const maxSize = (opts?.maxSizeMB ?? 50) * 1024 * 1024
  const accept = opts?.accept
  const autoStart = opts?.autoStart ?? true

  const [queue, setQueue] = useState<UploadItem[]>([])
  const timers = useRef<Record<string, number>>({})

  const isFull = queue.length >= maxFiles
  const isUploading = queue.some(i => i.status === 'uploading')

  const addFiles = useCallback((files: File[]) => {
    setQueue((prev) => {
      const existing = new Set(prev.map(i => `${i.file.name}:${i.file.size}`))
      const toAdd: UploadItem[] = []
      for (const f of files) {
        if (prev.length + toAdd.length >= maxFiles) break
        if (f.size > maxSize) {
          toAdd.push({ id: crypto.randomUUID(), file: f, status: 'error', progress: 0, error: 'File too large' })
          continue
        }
        if (accept && !accept.some(a => (a.endsWith('/*') ? f.type.startsWith(a.slice(0,-1)) : f.type === a))) {
          toAdd.push({ id: crypto.randomUUID(), file: f, status: 'error', progress: 0, error: 'Type not allowed' })
          continue
        }
        const key = `${f.name}:${f.size}`
        if (existing.has(key)) {
          // skip duplicate
          continue
        }
        toAdd.push({ id: crypto.randomUUID(), file: f, status: 'queued', progress: 0 })
      }
      const next = [...prev, ...toAdd]
      // Auto-start immediately after queuing new files
      if (autoStart && toAdd.some(i => i.status === 'queued')) {
        // Defer to next tick so state is applied
        queueMicrotask(() => start())
      }
      return next
    })
  }, [accept, maxFiles, maxSize])

  const start = useCallback(() => {
    setQueue((prev) => prev.map(i => (i.status === 'queued' ? { ...i, status: 'uploading' } : i)))
    setQueue((prev) => {
      prev.forEach((item) => {
        if (item.status !== 'uploading') return
        if (timers.current[item.id]) return
        const begin = Date.now()
        const totalMs = 2000 + Math.random() * 4000
        const tick = () => {
          const elapsed = Date.now() - begin
          const pct = Math.min(100, Math.round((elapsed / totalMs) * 100))
          const etaMs = Math.max(0, totalMs - elapsed)
          const eta = `${Math.ceil(etaMs / 1000)} sec left`
          setQueue((q) => q.map(it => it.id === item.id ? { ...it, progress: pct, eta } : it))
          if (pct >= 100) {
            setQueue((q) => q.map(it => it.id === item.id ? { ...it, status: 'done', eta: undefined } : it))
            cancelAnimationFrame(timers.current[item.id])
            delete timers.current[item.id]
          } else {
            timers.current[item.id] = requestAnimationFrame(tick)
          }
        }
        timers.current[item.id] = requestAnimationFrame(tick)
      })
      return prev
    })
  }, [])

  // (no effect) auto-start handled in addFiles()

  const cancel = useCallback((id: string) => {
    if (timers.current[id]) {
      cancelAnimationFrame(timers.current[id])
      delete timers.current[id]
    }
    setQueue(q => q.filter(i => i.id !== id))
  }, [])

  const remove = useCallback((id: string) => setQueue(q => q.filter(i => i.id !== id)), [])
  const retry = useCallback((id: string) => setQueue(q => q.map(i => i.id === id ? { ...i, status: 'queued', error: undefined, progress: 0 } : i)), [])
  const clear = useCallback(() => setQueue([]), [])

  return useMemo(() => ({ queue, addFiles, start, cancel, remove, retry, clear, isFull, isUploading }), [queue, addFiles, start, cancel, remove, retry, clear, isFull, isUploading])
}
