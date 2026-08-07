export type Task = {
  id: number
  title: string,
  descricao?: string
  done: boolean
  dueDate?: string
  parentId?: number 
  doneDate?: string
  priority?: Priority
  favourite: boolean,
}

export type Priority = 'high' | 'medium' | 'low' | 'completed'

export type DueState = 'overdue' | 'today' | 'future' | 'done'

export type ModalAction = 'create' | 'edit' | 'new-sub-task'

export type SortOption = 'priority' | 'title' | 'dueDate'

export type TaskComparator = {
  label: string;
  function: (a:Task, b: Task) => number
}