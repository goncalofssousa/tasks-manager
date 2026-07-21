import { ref, computed } from 'vue'
import type { Task } from '../types/tasks'
import type { Filter } from '../types/filter'
import { useTaskState } from './useTaskState'

export function useTaskFilters() {

    const filterOptions: Record<string, Filter[]> = {
        'priority': [
            {label: 'High Priority', value: 'high'},
            {label: 'Medium Priority', value: 'medium'},
            {label: 'Low Priority', value: 'low'},
        ],
        'favourite': [
            {label: 'Favourites', value: 'favourites'},
            {label: 'Non Favourites', value: 'nonFavourites'},
        ],
        'state': [
            {label: 'Overdue', value: 'overdue'},
            {label: 'Due Today', value: 'today'},
            {label: 'Future', value: 'future'},
        ]
    }

    const currentFilterValues = ref<string[]>([])


    function handleFilterClick(value: string) {
        const index = currentFilterValues.value.indexOf(value)

        if (index < 0) {
            currentFilterValues.value.push(value)
        } else {
            currentFilterValues.value.splice(index, 1)
        }
    }

    function resetFilters() {
        currentFilterValues.value = []
    }

    function removeFilter(key: string) {
        const index = currentFilterValues.value.indexOf(key)
        if (index >= 0) {
            currentFilterValues.value.splice(index, 1)
        }
    }

    function matchesPriority(task: Task){
        const activePriorities = currentFilterValues.value.filter(v => filterOptions['priority'].map(f => f.value).includes(v))
        
        if (activePriorities.length > 0 && !activePriorities.includes(task.priority || '')) {
            return false
        }

        return true
    }

    function matchesFavourites(task: Task){
        const activeFavourites = currentFilterValues.value.filter(v => filterOptions['favourite'].map(f => f.value).includes(v))
        
        if (activeFavourites.length > 0) {
            const taskFavKey = task.favourite ? 'favourites' : 'nonFavourites'
            if (!activeFavourites.includes(taskFavKey)) return false
        }

        return true
    }

    function matchesStatus(task: Task){
        const {dueState} = useTaskState(task)
        const activeStatus = currentFilterValues.value.filter(v => filterOptions['state'].map(f => f.value).includes(v))

        if(activeStatus.length > 0){
            if(!activeStatus.includes(dueState.value)) return false
        }

        return true
    }

    function matches(task: Task) {
        return matchesPriority(task) && matchesFavourites(task) && matchesStatus(task)
    }

    const hasActiveFilters = computed(() => {
        for(const key in currentFilterValues.value){
            if(currentFilterValues.value[key].length > 0) return true
        }
        return false
    })

    return {
        filtersValue: currentFilterValues,
        handleFilterClick,
        filterOptions,
        resetFilters,
        removeFilter,
        matches,
        hasActiveFilters
    }
}