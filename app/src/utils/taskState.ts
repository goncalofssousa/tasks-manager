import type { Task, DueState } from '../types/tasks'

function getDueDate(task: Task): number | null {
    if (!task.dueDate) return null

    const date = new Date(task.dueDate)

    if (isNaN(date.getTime())) return null

    date.setHours(0, 0, 0, 0)

    return date.getTime()
}

export function getDueState(task: Task): DueState {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (task.done) return 'done'

    const dueDate = getDueDate(task)

    if (!dueDate) return 'future'

    if (dueDate < today.getTime()) return 'overdue'

    if (dueDate === today.getTime()) return 'today'

    return 'future'
}

export function getTimeSinceOverdue(task: Task): string {
    const dueDate = getDueDate(task)

    if (!dueDate || getDueState(task) !== 'overdue') {
        return ''
    }

    const diffMs = Date.now() - dueDate
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
}