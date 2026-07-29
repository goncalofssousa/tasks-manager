import { ref, computed } from 'vue'
import type { Task } from '../types/tasks'
import type { ActiveFilter, Filter, FilterGroup } from '../types/filter'
import { getDueState } from '../utils/taskState'

export function useTaskFilters() {
    const filterOptions: Record<FilterGroup, Filter[]> = {
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
            {label: 'Upcoming', value: 'future'},
        ]
    }

    const currentFilterValues = ref<Record<FilterGroup,string[]>>({
        'priority': [],
        'favourite': [],
        'state': []
    })

    const hasActiveFilters = computed(() => {
        for(const key in currentFilterValues.value){
            const group = key as FilterGroup
            if(currentFilterValues.value[group].length > 0) return true
        }
        return false
    })

    const activeFilters = computed<ActiveFilter[]>(() => {
        const active: ActiveFilter[] = []
        for(const key in currentFilterValues.value){
            const group = key as FilterGroup
            for(const entry of currentFilterValues.value[group]){
                const filter = filterOptions[group].find(filter => filter.value === entry)
                if(filter){
                    active.push({
                        group: group,
                        value: entry,
                        label: filter.label
                    })
                }
            }
        }
        return active
    })

    function handleFilterClick(value: string, section: FilterGroup) {
        const index = currentFilterValues.value[section].indexOf(value)

        if (index < 0) {
            currentFilterValues.value[section].push(value)
        } else {
            currentFilterValues.value[section].splice(index, 1)
        }
    }

    function resetFilters() {
        for(const key in currentFilterValues.value){
            const group = key as FilterGroup
            currentFilterValues.value[group] = []
        }
    }

    function removeFilter(section: FilterGroup, key: string) {
        const index = currentFilterValues.value[section].indexOf(key)
        if (index >= 0) {
            currentFilterValues.value[section].splice(index, 1)
        }
    }

    function matchesArray(filters: string[], value: string) {
        return filters.length === 0 || filters.includes(value)
    }

    function matchesPriority(task: Task) {
        return matchesArray(currentFilterValues.value.priority, task.priority ?? '')
    }

    function matchesFavourite(task: Task) {
        return matchesArray(
            currentFilterValues.value.favourite,
            task.favourite ? 'favourites' : 'nonFavourites'
        )
    }

    
    function matchesState(task: Task) {
        return matchesArray(
            currentFilterValues.value.state,
            getDueState(task)
        )
    }

    function matches(task: Task) {
        return matchesPriority(task) && matchesFavourite(task) && matchesState(task)
    }

    return {
        filtersValue: currentFilterValues,
        hasActiveFilters,
        activeFilters,
        handleFilterClick,
        filterOptions,
        resetFilters,
        removeFilter,
        matches,
    }
}