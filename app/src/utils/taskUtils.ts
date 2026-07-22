import type { Task } from "../types/tasks"

const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export function compareTasksPriority(a: Task, b: Task): number {
  const aPriority = priorityRank[a.priority ?? ''] ?? 0
  const bPriority = priorityRank[b.priority ?? ''] ?? 0

  if (aPriority !== bPriority) return bPriority - aPriority
  return 0
}

export function compareTasksDate(a: Task, b: Task): number {
  if(a.dueDate !== '' && b.dueDate === '') return -1; 
  if(a.dueDate === '' && b.dueDate !== '') return 1; 
  return new Date(a.dueDate ?? '').getTime() - new Date(b.dueDate ?? '').getTime()
}

export function compareTasksTitle(a: Task, b: Task): number{
  return a.title.localeCompare(b.title)
}