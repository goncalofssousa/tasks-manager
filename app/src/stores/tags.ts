import { defineStore } from "pinia";
import type { Tag } from "../types/tasks";
import { useTasksStore } from "./tasks";

const TAG_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899'
]

export const useTagsStore = defineStore('tags', {
    state: () => ({
        tags: {} as Record<string, Tag>
    }),

    getters: {
        tagsLength(): number{
            return Object.values(this.tags).length
        }
    },

    actions: {
        addTag(label: string){
            const tagId = label.toLowerCase()
            if(this.tags[tagId]) return  

            const tagColor = TAG_COLORS[this.tagsLength % TAG_COLORS.length]

            const tag = {
                key: tagId,
                label: label,
                color: tagColor 
            } as Tag

            this.tags[tagId] = tag
        },

        removeTag(key: string){
            if(!this.tags[key]) return 

            const taskStore = useTasksStore()
            
            taskStore.removeTagFromAllTasks(key)

            delete this.tags[key]

        }
    }
})