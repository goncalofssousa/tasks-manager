import { computed } from 'vue'
import type { Task } from '../stores/tasks'

export type DueState = 'overdue' | 'today' | 'future' | 'done'

export function useTaskDate(task: Task) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = computed<number | null>(() => {
    if (!task.dueDate) return null

    const date = new Date(task.dueDate)
    if (isNaN(date.getTime())) return null

    date.setHours(0, 0, 0, 0)
    return date.getTime()
  })

  const dueState = computed<DueState>(() => {
    if (task.done) return 'done'
    if (!dueDate.value) return 'future'

    if (dueDate.value < today.getTime()) return 'overdue'
    if (dueDate.value === today.getTime()) return 'today'

    return 'future'
  })

  const timeSinceOverdue = computed(() => {
    if (dueState.value !== 'overdue' || !dueDate.value) return ''

    const diffMs = Date.now() - dueDate.value
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays >= 30) {
      return `${Math.floor(diffDays / 30)} months overdue`
    }

    if (diffDays >= 7) {
      return `${Math.floor(diffDays / 7)} weeks overdue`
    }

    if (diffDays < 1) return 'Overdue today'
    if (diffDays === 1) return '1 day overdue'

    return `${diffDays} days overdue`
  })

  return {
    dueDate,
    dueState,
    timeSinceOverdue
  }
}