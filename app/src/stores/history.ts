import { defineStore } from 'pinia'
import type { Activity, ActivityType } from '../types/history'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [] as Activity[] 
  }),

  actions: {
    addActivity(type: ActivityType, taskId: number, taskName: string, mainTaskName?: string) {
      const activity = {
        id: Date.now(),
        type: type,
        taskId: taskId,
        mainTaskName: mainTaskName,
        taskName: taskName,
        date: new Date().toISOString()
      }
      this.history.unshift(activity)
    },  

    clearFilteredHistory(typesFiltered: string[]){
      this.history = this.history.filter(activity => !typesFiltered.includes(activity.type))
    },

    clearAllHistory(){
      this.history = []
    }
  }
})