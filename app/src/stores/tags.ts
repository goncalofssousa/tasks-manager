import { defineStore } from "pinia";
import type { Tag } from "../types/tasks";
import { useTasksStore } from "./tasks";

export const useTagsStore = defineStore('tags', {
    state: () => ({
        tags: {} as Record<string, Tag>
    }),

    actions: {
        addTag(label: string){
            const tagId = label.toLowerCase()
            if(this.tags[tagId]) return  

            const tag = {
                key: tagId,
                label: label 
            } as Tag

            this.tags[tagId] = tag
        },

        removeTag(key: string){
            if(this.tags[key]){
                delete this.tags[key]
            }

            const taskStore = useTasksStore()
            
            taskStore.removeTagFromAllTasks(key)
        }
    }
})