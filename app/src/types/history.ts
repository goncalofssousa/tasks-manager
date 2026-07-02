export type ActivityType = 
    | "task_created"
    | "task_completed"
    | "task_removed"
    | "task_undone"
    | "deadline_changed"

export interface Activity {
    id: number 
    type: ActivityType
    taskId: number 
    mainTaskName?: string
    taskName: string
    date: string
}