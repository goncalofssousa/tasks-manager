export type Task = {
  id: number
  title: string,
  descricao?: string
  done: boolean
  dueDate?: string
  parentId?: number 
  doneDate?: string
  priority?: Priority
}

export type Priority = 'High' | 'Medium' | 'Low'

export type DueState = 'overdue' | 'today' | 'future' | 'done'
