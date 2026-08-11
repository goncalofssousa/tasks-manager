import { defineStore } from "pinia";
import type { Tag } from "../types/tasks";
import { useTasksStore } from "./tasks";
import type { Filter } from "../types/filter";

const TAG_COLORS = [
  '#d66b6b',
  '#d88a62',
  '#c7aa55',
  '#68aa7d',
  '#55a9b8',
  '#648bc4',
  '#8d78bd',
  '#c2769a'
]

export const useTagsStore = defineStore('tags', {
    state: () => ({
        tags: {} as Record<string, Tag>
    }),

    getters: {
        tagsLength(): number{
            return Object.values(this.tags).length
        },

        tagsToFilter(): Filter[] {
            return Object.values(this.tags).map(tag => {
                const filter = {
                    label: tag.label,
                    value: tag.key
                } 
                return filter
            })
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