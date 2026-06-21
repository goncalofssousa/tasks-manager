import { defineStore } from 'pinia'

export type Task = {
  id: number
  descricao: string
  done: boolean
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
    addTask(text: string) {
      this.tasks.push({
        id: Date.now(),
        descricao: text,
        done: false
      })
      this.save()
    },

    markAsDone(id: number) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.done = true
      this.save()
    },

    removeTask(id: number) {
      this.tasks = this.tasks.filter(t => t.id !== id)
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