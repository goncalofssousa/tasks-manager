import type { Task } from "../types/tasks"

export function  compareTasks(a: Task, b: Task) {
    if(a.dueDate !== '' && b.dueDate === '') return -1; 
    if(a.dueDate === '' && b.dueDate !== '') return 1; 
    return new Date(a.dueDate ?? '').getTime() - new Date(b.dueDate ?? '').getTime()
}

export function toDate(date?: string) {
  return date ? new Date(date) : null
}