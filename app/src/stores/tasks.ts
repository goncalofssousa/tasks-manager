import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import type { Task } from '../types/tasks'
import { compareTasks } from '../utils/taskUtils'

export type TasksState = {
  ids: number[], 
  entities: Record<number, Task>
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    ids: [], 
    entities: {}
  }),

  getters: {
    allTasks: (state) => {
      return state.ids.map(id => state.entities[id])
    },

    mainTasks(): Task[] {
      return this.allTasks.filter(t => t.parentId === undefined).sort(compareTasks)
    },

    subTasksMap(): Record<number, Task[]> {
      const map: Record<number, Task[]> = {}

      for (const task of this.allTasks) {
        if (task.parentId === undefined) continue

        if (!map[task.parentId]) {
          map[task.parentId] = []
        }

        map[task.parentId].push(task)
      } 

      for(const parentId in map){
        map[parentId].sort(compareTasks)
      }

      return map
    }
  },

  actions: {
    addTask(title: string, text: string, date: string, parentId?: number) { 
      const task = {
        id: Date.now(),
        title: title,
        descricao: text,
        done: false,
        dueDate: date,
        parentId: parentId
      }

      this.ids.push(task.id)
      this.entities[task.id] = task
      
      const historyStore = useHistoryStore()
      if(parentId === null || parentId === undefined) historyStore.addActivity("task_created", task.id, task.title)
      else historyStore.addActivity("task_created", task.id, task.title, this.entities[parentId].title)
    },  

    removeTask(id: number) {
      const historyStore = useHistoryStore()

      const task = this.entities[id]
      if(!task) return 
      
      if(task.parentId === null || task.parentId === undefined) {
        this.ids = this.ids.filter(taskId => taskId !== id)

        historyStore.addActivity("task_removed", id, task.title)

        delete this.entities[id]

        for(const taskId of this.ids){
          const subTask = this.entities[taskId]

          if(subTask?.parentId === id){
            delete this.entities[taskId]
          } 
        }

        this.ids = this.ids.filter(taskId => this.entities[taskId])

      }
      else{
        this.ids = this.ids.filter(taskId => taskId !== id)

        delete this.entities[id]

        historyStore.addActivity("task_removed", id, task.title, this.entities[task.parentId].title) 
      }

    },

    updateTask(id: number, updatedData: {
        title: string
        descricao: string
        dueDate: string
    }) {
        const task = this.entities[id]
        if (!task) return

        const historyStore = useHistoryStore()

        task.title = updatedData.title
        task.descricao = updatedData.descricao

        if(task.dueDate !== updatedData.dueDate){
          if(task.parentId !== undefined) historyStore.addActivity("deadline_changed", task.id, task.title, this.entities[task.parentId].title)
          else historyStore.addActivity("deadline_changed", task.id, task.title)
        }
        task.dueDate = updatedData.dueDate
    },

    markAsDone(id: number) {
      const task = this.entities[id]
      if (task) {
        const historyStore = useHistoryStore()
        task.doneDate = new Date().toISOString().split('T')[0]
        task.done = true

        if(task.parentId !== undefined) {
          historyStore.addActivity("task_completed", task.id, task.title, this.entities[task.parentId].title)
          return 
        }

        for(const taskId of this.ids){
          const subTask = this.entities[taskId]
          if(subTask?.parentId === id){
            subTask.done = true
            subTask.doneDate = task.doneDate
          } 
        }

        this.ids.filter(taskId => this.entities[taskId])

        historyStore.addActivity("task_completed", task.id, task.title)
      }
    },

    markAsUnDone(id: number) {
      const task = this.entities[id]
      if (task) {
        const historyStore = useHistoryStore()

        task.done = false

        if(task.parentId !== undefined){
          const mainTask = this.entities[task.parentId]
          if(mainTask){
            if(mainTask.done){
              mainTask.done = false
              mainTask.doneDate = undefined
            }
          }
          historyStore.addActivity("task_undone", task.id, task.title, this.entities[task.parentId].title)
        }
        else {
          historyStore.addActivity("task_undone", task.id, task.title)
        }
      }
    },
  }
})