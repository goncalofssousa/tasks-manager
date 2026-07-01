export type Task = {
  id: number
  title: string,
  descricao?: string
  done: boolean
  dueDate?: string
  parentId?: number 
  doneDate?: string
}

export type DueState = 'overdue' | 'today' | 'future' | 'done'
