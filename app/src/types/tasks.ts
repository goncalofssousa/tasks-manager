export type Task = {
  id: number
  title: string
  descricao?: string
  done: boolean
  dueDate?: string
  parentId?: number 
  doneDate?: string
  priority?: Priority
  favourite: boolean
  tagIds: string[]
}

export type TaskSubmitData = {
  title: string
  descricao: string
  dueDate: string
  parentId?: number
  priority?: Priority
  tagIds: string[]
}

export type Priority = 'high' | 'medium' | 'low' | 'completed'

export type DueState = 'overdue' | 'today' | 'future' | 'done'

export type ModalAction = 'create' | 'edit' | 'new-sub-task'

export type SortOption = 'priority' | 'title' | 'dueDate'

export type TaskComparator = {
  label: string;
  function: (a:Task, b: Task) => number
}

export type Tag = {
  key: string
  label: string
  color: string
}