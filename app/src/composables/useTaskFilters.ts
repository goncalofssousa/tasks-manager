import { ref, computed } from 'vue'
import type { Task } from '../types/tasks'
import type { ActiveFilter, Filter, FilterGroup } from '../types/filter'
import { getDueState } from '../utils/taskState'
import { useTagsStore } from '../stores/tags'

export function useTaskFilters() {
    const tagsStore = useTagsStore()

    const filterOptions = computed<Record<FilterGroup, Filter[]>>(() => ({
    priority: [
        { label: 'High Priority', value: 'high' },
        { label: 'Medium Priority', value: 'medium' },
        { label: 'Low Priority', value: 'low' },
    ],

    favourite: [
        { label: 'Favourites', value: 'favourites' },
        { label: 'Non Favourites', value: 'nonFavourites' },
    ],

    state: [
        { label: 'Overdue', value: 'overdue' },
        { label: 'Due Today', value: 'today' },
        { label: 'Upcoming', value: 'future' },
    ],

    tags: tagsStore.tagsToFilter
}))

    const currentFilterValues = ref<Record<FilterGroup,string[]>>({
        'priority': [],
        'favourite': [],
        'state': [], 
        'tags': []
    })

    const hasActiveFilters = computed(() =>Object.values(currentFilterValues.value).some(filters => filters.length > 0))

    const activeFilters = computed<ActiveFilter[]>(() => {
        const active: ActiveFilter[] = []
        for(const key in currentFilterValues.value){
            const group = key as FilterGroup
            for(const entry of currentFilterValues.value[group]){
                const filter = filterOptions.value[group].find(filter => filter.value === entry)
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

    function matchesGroup(group: FilterGroup, value: string) {
        const filters = currentFilterValues.value[group]
        return filters.length === 0 || filters.includes(value)
    }

    function matchesPriority(task: Task) {
        return matchesGroup('priority', task.priority ?? '')
    }

    function matchesFavourite(task: Task) {
        return matchesGroup(
            'favourite',
            task.favourite ? 'favourites' : 'nonFavourites'
        )
    }

    function matchesState(task: Task) {
        return matchesGroup('state', getDueState(task))
    }

    function matchesTags(task: Task) {
        const filters = currentFilterValues.value.tags

        if (filters.length === 0) return true

        return task.tagIds.some(tagId => filters.includes(tagId))
    }

    function matches(task: Task) {
        return (
            matchesPriority(task) &&
            matchesFavourite(task) &&
            matchesState(task) &&
            matchesTags(task)
        )
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