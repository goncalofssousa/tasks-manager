import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import type { Priority, Task } from '../types/tasks'
import { toDate } from '../utils/formats'
import { useTagsStore } from './tags'

export type TasksData = {
  ids: number[], 
  entities: Record<number, Task>, 
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksData => ({
    ids: [], 
    entities: {},
  }),

  getters: {
    allTasks: (state) => {
      return state.ids.map(id => state.entities[id])
    },

    mainTasks(): Task[] {
      return this.allTasks.filter(t => t.parentId === undefined)
    },

    mainTasksActive(): Task[] {
      return this.mainTasks.filter(t => !t.done)
    },

    mainTasksDone(): Task[] {
      return this.mainTasks.filter(t => t.done)
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

      return map
    }
  },

  actions: {
    addTask(title: string, text: string, date: string, parentId?: number, priority?: Priority) {
      if (parentId !== undefined) {
        const parentTask = this.entities[parentId]

        if (parentTask?.dueDate && date === '') {
          date = parentTask.dueDate
        }
      }

      const task = {
        id: Date.now(),
        title,
        descricao: text,
        done: false,
        dueDate: date,
        parentId, 
        priority: priority,
        favourite: false, 
        tagIds: []
      }

      this.ids.push(task.id)
      this.entities[task.id] = task

      const historyStore = useHistoryStore()

      historyStore.addActivity("task_created", task)
    },

    removeTask(id: number) {
      const historyStore = useHistoryStore()

      const task = this.entities[id]
      if(!task) return 
      
      if(task.parentId === null || task.parentId === undefined) {
        this.ids = this.ids.filter(taskId => taskId !== id)

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
      }

      historyStore.addActivity("task_removed", task) 
    },

    updateTask(id: number, updatedData: {
        title: string
        descricao: string
        dueDate: string
        priority?: Priority
      }
    ) {
      const task = this.entities[id]
      if (!task) return

      const historyStore = useHistoryStore()

      const oldDate = toDate(task.dueDate)
      const newDate = toDate(updatedData.dueDate)

      if (task.parentId !== undefined) {
        const parentTask = this.entities[task.parentId]
        const parentDate = toDate(parentTask?.dueDate)

        if (parentDate && newDate && newDate > parentDate) {
          return
        }
      }

      task.title = updatedData.title
      task.descricao = updatedData.descricao

      if (task.dueDate !== updatedData.dueDate) {
        if (task.parentId === undefined && newDate && (!oldDate || newDate < oldDate)) {
          const subTasks = this.subTasksMap[id] || []

          for (const subTask of subTasks) {
            const subDate = toDate(subTask.dueDate)

            if (!subDate || subDate > newDate) {
              subTask.dueDate = updatedData.dueDate
            }
          }
        }

      }
      task.dueDate = updatedData.dueDate
      task.priority = updatedData.priority
      
      historyStore.addActivity("task_updated", task)

    },

    markAsDone(id: number) {
      const task = this.entities[id]
      if (task) {
        const historyStore = useHistoryStore()
        task.doneDate = new Date().toISOString().split('T')[0]
        task.done = true

        if(task.parentId !== undefined) {
          historyStore.addActivity("task_completed", task)
          return 
        }

        for(const taskId of this.ids){
          const subTask = this.entities[taskId]
          if(subTask?.parentId === id){
            subTask.done = true
            subTask.doneDate = task.doneDate
          } 
        }

        historyStore.addActivity("task_completed", task)
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
        }
        historyStore.addActivity("task_undone", task)
      }
    },

    toggleFavourite(taskId: number){
      const historyStore = useHistoryStore()
      const task = this.entities[taskId]
      task.favourite = !task.favourite
      historyStore.addActivity("task_favourite", task)
    }, 

    associateTag(taskId: number, tagId: string){
      const tagsStore = useTagsStore()
      if(!this.entities[taskId] || !tagsStore.tags[tagId] || this.entities[taskId].tagIds?.includes(tagId)) return
      this.entities[taskId].tagIds?.unshift(tagId) 
    },

    removeTagFromTask(taskId: number, tagIdToRemove: string){
      const tagsStore = useTagsStore()
      if(!this.entities[taskId] || !tagsStore.tags[tagIdToRemove] || !this.entities[taskId].tagIds?.includes(tagIdToRemove)) return
      this.entities[taskId].tagIds = this.entities[taskId].tagIds.filter(tagId => tagId != tagIdToRemove)  
    },

    removeTagFromAllTasks(tagIdToRemove: string){
      for(const taskId of this.ids){
        this.entities[taskId].tagIds = this.entities[taskId].tagIds?.filter(tagId => tagId != tagIdToRemove)  
      }
    }
  }
})