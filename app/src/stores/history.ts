import { defineStore } from 'pinia'
import type { Activity, ActivityType } from '../types/history'
import type { Task } from '../types/tasks'
import { getActivityClass, getLabel } from '../utils/historyUtils'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [] as Activity[] 
  }),

  actions: {
    addActivity(type: ActivityType, task: Task) {
      const activity = {
        id: Date.now(),
        type: type,
        label: getLabel(type, task),
        class: getActivityClass(type, task),
        date: new Date().toISOString(),
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