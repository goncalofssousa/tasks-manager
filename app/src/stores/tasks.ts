import { defineStore } from 'pinia'


export type Task = {
  id: number
  title: string,
  descricao: string
  done: boolean
  dueDate?: string
  parentId?: number 
  doneDate?: string
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
      this.tasks = this.tasks.filter(t => t.id !== id && t.parentId !== id)
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
      if (task) {
        task.doneDate = new Date().toISOString().split('T')[0]
        task.done = true
        this.tasks.forEach(t => {
          if(t.parentId === id && t.id !== id){
            t.done = true
            t.doneDate = new Date().toISOString().split('T')[0]
          }
        })
      }
      this.save()
    },

    markAsUnDone(id: number) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.done = false
        if(task.parentId !== null){
          const mainTask = this.tasks.find(t => t.id === task.parentId)
          if(mainTask){
            if(mainTask.done){
              mainTask.done = false
              mainTask.doneDate = undefined

            }
          }
        }
      }
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