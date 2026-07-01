import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import type { Task } from '../types/tasks'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[]
  }),

  getters: {
    unDoneTaks: (state) => state.tasks.filter(t => !t.done),
    completeTasks: (state) => state.tasks.filter(t => t.done),
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
      this.tasks.push(task)
      const historyStore = useHistoryStore()
      if(parentId === null || parentId === undefined) historyStore.addActivity("task_created", task.id, task.title)
      else historyStore.addActivity("task_created", task.id, task.title, task.parentId)
    },  

    removeTask(id: number) {
      const historyStore = useHistoryStore()

      const task = this.tasks.find(t => t.id === id)
      if(!task) return 

      if(task.parentId === null || task.parentId === undefined) historyStore.addActivity("task_removed", id, task.title)
      else historyStore.addActivity("task_removed", id, task.title, task.parentId) 

      this.tasks = this.tasks.filter(t => t.id !== id && t.parentId !== id)
    },

    updateTask(id: number, updatedData: {
        title: string
        descricao: string
        dueDate: string
    }) {
        const task = this.tasks.find(t => t.id === id)

        if (!task) return

        const historyStore = useHistoryStore()
        task.title = updatedData.title
        task.descricao = updatedData.descricao
        if(task.dueDate !== updatedData.dueDate){
          if(task.parentId !== undefined) historyStore.addActivity("deadline_changed", task.id, task.title, task.parentId)
          else historyStore.addActivity("deadline_changed", task.id, task.title)
        }
        task.dueDate = updatedData.dueDate
    },

    markAsDone(id: number) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        const historyStore = useHistoryStore()
        task.doneDate = new Date().toISOString().split('T')[0]
        task.done = true
        if(task.parentId !== undefined) {
          historyStore.addActivity("task_completed", task.id, task.title, task.parentId)
          return 
        }
        this.tasks.forEach(t => {
          if(t.parentId === id && t.id !== id){
            t.done = true
            t.doneDate = new Date().toISOString().split('T')[0]
          }
        })
        historyStore.addActivity("task_completed", task.id, task.title)
      }
    },

    markAsUnDone(id: number) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        const historyStore = useHistoryStore()
        task.done = false
        if(task.parentId !== null){
          const mainTask = this.tasks.find(t => t.id === task.parentId)
          if(mainTask){
            if(mainTask.done){
              mainTask.done = false
              mainTask.doneDate = undefined
            }
          }
          historyStore.addActivity("task_undone", task.id, task.title, task.parentId)
        }
        else {
          historyStore.addActivity("task_undone", task.id, task.title)
        }
      }
    },
  }
})