import type { Task } from "../types/tasks"

const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export function compareTasks(a: Task, b: Task) {
  const aPriority = priorityRank[a.priority ?? ''] ?? 0
  const bPriority = priorityRank[b.priority ?? ''] ?? 0

  if (aPriority !== bPriority) return bPriority - aPriority

  if(a.dueDate !== '' && b.dueDate === '') return -1; 
  if(a.dueDate === '' && b.dueDate !== '') return 1; 
  return new Date(a.dueDate ?? '').getTime() - new Date(b.dueDate ?? '').getTime()
}

export function toDate(date?: string) {
  return date ? new Date(date) : null
}