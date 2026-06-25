import { defineStore } from 'pinia'


export type Task = {
  id: number
  title: string,
  descricao: string
  done: boolean
  dueDate?: string
  parentId?: number 
}

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
      this.save()
    },  

    removeTask(id: number) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.save()
    },

    updateTask(id: number, updatedData: {
        title: string
        descricao: string
        dueDate: string
    }) {
        const task = this.tasks.find(t => t.id === id)

        if (!task) return

        task.title = updatedData.title
        task.descricao = updatedData.descricao
        task.dueDate = updatedData.dueDate
        this.save()
    },

    markAsDone(id: number) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.done = true
      this.save()
    },

    markAsUnDone(id: number) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.done = false
      this.save()
    },

    deleteAll() {
      this.tasks = []
      this.save()
    },

    save() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    load() {
      const data = localStorage.getItem('tasks')
      if (data) this.tasks = JSON.parse(data)
    }
  }
})