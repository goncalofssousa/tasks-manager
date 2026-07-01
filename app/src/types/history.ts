export type ActivityType = 
    | "task_created"
    | "task_completed"
    | "task_removed"
    | "task_undone"
    | "subtask_created"
    | "subtask_completed"
    | "subtask_undone"
    | "deadline_changed"

export interface Activity {
    id: number 
    type: ActivityType
    taskId: number 
    mainTaskId?: number
    taskName: string
    date: string
}