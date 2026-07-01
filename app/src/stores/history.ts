import { defineStore } from 'pinia'
import type { Activity, ActivityType } from '../types/history'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [] as Activity[] 
  }),

  actions: {
    addActivity(type: ActivityType, taskId: number, taskName: string, mainTaskId?: number) {
      const activity = {
        id: Date.now(),
        type: type,
        taskId: taskId,
        taskName: taskName,
        mainTaskId: mainTaskId,
        date: new Date().toISOString()
      }
      this.history.unshift(activity)
    },  

    clearHistory(){
      this.history.splice(0, this.history.length)
    }
  }
})