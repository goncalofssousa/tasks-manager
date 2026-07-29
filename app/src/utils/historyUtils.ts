import { CheckCircle2, ListCheck, Pencil, PlusCircle, RotateCcw, Star, Trash2 } from "lucide-vue-next"
import type { ActivityType } from "../types/history"
import type { Task } from "../types/tasks"

export function getIcon(type: ActivityType) {
  switch (type) {
    case 'task_created':
      return PlusCircle
    case 'task_completed':
      return CheckCircle2
    case 'task_removed':
      return Trash2
    case 'task_undone':
      return RotateCcw
    case 'task_updated':
      return Pencil
    case 'task_favourite':
      return Star
    default:
      return ListCheck
  }
}

export function getLabel(type: ActivityType, task: Task): string {
  switch (type) {
    case 'task_created':
      return task.parentId !== undefined  
            ? `Created subtask "${task.title}"` 
            :`Created task "${task.title}"`

    case 'task_completed': 
      return task.parentId !== undefined
            ? `Completed subtask "${task.title}"`
            : `Completed task "${task.title}""`

    case 'task_removed':
      return task.parentId
            ? `Removed subtask "${task.title}"`
            : `Removed task "${task.title}"`

    case 'task_undone':
      return task.parentId
            ? `Reopened subtask "${task.title}"`
            : `Reopened task "${task.title}"`

    case 'task_updated':      
      return task.parentId 
              ? `Updated subtask "${task.title}"`
              : `Updated task "${task.title}"`

    case 'task_favourite':
      return task.favourite  
              ? `Task "${task.title}" marked as favourite`
              : `Task "${task.title}" unmarked as favourite`

    default:
      return task.title
  }
}

export function getActivityClass(type: ActivityType, task: Task): string {
    switch(type) {
      case 'task_completed': 
       return 'green'
      
      case 'task_removed': 
        return 'red'

      case 'task_favourite': 
        return task.favourite ? 'yellow' : ''
      
      case 'task_updated': 
        return 'blue'
      
      case 'task_undone':
          return 'yellow'
        
      default: return ''
    }
}