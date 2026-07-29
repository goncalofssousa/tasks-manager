export type ActivityType = 
    | "task_created"
    | "task_completed"
    | "task_removed"
    | "task_undone"
    | "task_updated"
    | "task_favourite"


export type Activity = {
    id: number 
    type: ActivityType
    label: string
    class: string
    date: string
}