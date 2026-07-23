import { CalendarClock, CheckCircle2, ListCheck, PlusCircle, RotateCcw, Trash2 } from "lucide-vue-next"
import type { Activity, ActivityType } from "../types/history"

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
    case 'deadline_changed':
      return CalendarClock
    default:
      return ListCheck
  }
}

export function getLabel(activity: Activity): string {
  switch (activity.type) {
    case 'task_created':
      return activity.mainTaskName 
            ? `Created subtask "${activity.taskName}" in main task "${activity.mainTaskName}"` 
            :`Created task "${activity.taskName}"`

    case 'task_completed': 
      return activity.mainTaskName
            ? `Completed subtask "${activity.taskName}" in main task  "${activity.mainTaskName}"`
            : `Completed task "${activity.taskName}"`

    case 'task_removed':
      return activity.mainTaskName
            ? `Removed subtask "${activity.taskName}" in main task  "${activity.mainTaskName}"`
            : `Removed task "${activity.taskName}"`

    case 'task_undone':
      return activity.mainTaskName
            ? `Reopened subtask "${activity.taskName}" in main task  "${activity.mainTaskName}"`
            : `Reopened task "${activity.taskName}"`

    case 'deadline_changed':
      return activity.mainTaskName 
              ? `Changed deadline for subtask "${activity.taskName}" in task ${activity.mainTaskName}`
              : `Changed deadline for task "${activity.taskName}"`

    default:
      return activity.taskName
  }
}