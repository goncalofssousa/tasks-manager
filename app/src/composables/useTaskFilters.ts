import { ref, computed } from 'vue'
import type { Filter } from '../types/filter'
import type { Task } from '../types/tasks'

export function useTaskFilters() {

    const filterOptions: Record<string, Filter[]> = {
        "Priority": [
            {label: "High", value: "high"}, 
            {label: "Medium", value: "medium"}, 
            {label: "Low", value: "low"}
        ],
        "Favourite": [
            {label: "Favourite", value:"favourite"},
            {label: "Non-Favourite", value:"nonFavourite"}
        ]
    }

    const filtersValue = ref<Record<string, string[]>>({ 
        "Priority": [],
        "Favourite": []
    })

    function handleFilterClick(value: string, title?: string) {
        if (title) {
            const index = filtersValue.value[title].indexOf(value)
            if (index >= 0) {
                filtersValue.value[title].splice(index, 1)
            } else {
                filtersValue.value[title] = [value]
            }
        }
    }

    function resetFilters() {
        for(const key in filtersValue.value) {
            filtersValue.value[key] = []
        }
    }

    const activeFilterChips = computed(() => {
        const chips: Record<string, string> = {}
        for(const entrykey in filtersValue.value) {
            const filterValues = filtersValue.value[entrykey]
            if(!filterValues || filterValues.length === 0) continue
            chips[entrykey] = filterValues[0]
        }
        return chips
    })

    function removeFilterChip(key: string){
        filtersValue.value[key] = []
    }


    function matchesPriority(task: Task) {
        return (
            filtersValue.value.Priority.length === 0 ||
            (task.priority && filtersValue.value.Priority[0] === task.priority)
        )
    }

    function matchesFavourite(task: Task) {
        return (
            filtersValue.value.Favourite.length === 0 || 
            (filtersValue.value.Favourite[0] === 'favourite' && task.favourite) ||
            (filtersValue.value.Favourite[0] === 'nonFavourite' && !task.favourite) 
        )
    }

    function matches(task: Task) {
        return matchesPriority(task) && matchesFavourite(task)
    }

    const hasActiveFilters = computed(() =>{
        return Object.values(filtersValue.value).some(values => values.length > 0)
    })

    return { 
        filtersValue, 
        handleFilterClick, 
        activeFilterChips, 
        filterOptions, 
        resetFilters,
        removeFilterChip,
        matches, 
        hasActiveFilters
    }

}