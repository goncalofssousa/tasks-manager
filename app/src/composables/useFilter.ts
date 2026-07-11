import { ref } from 'vue'

export function useFilter(){
    const currentFilterValues = ref<string[]>(['all'])

    function handleMultipleFilterClicked(value: string) {
        if (value === 'all') {
            currentFilterValues.value = ['all']
            return
        }
        const index = currentFilterValues.value.indexOf(value)
        
        if(index < 0){
            const indexAll = currentFilterValues.value.indexOf('all')
            if(indexAll >= 0){
            currentFilterValues.value.splice(indexAll,1)
            }
            currentFilterValues.value.push(value)
        } else {
            currentFilterValues.value.splice(index,1)
            if(currentFilterValues.value.length === 0) currentFilterValues.value.push('all')
        }
    }

    function handleSingleFilterClicked(value: string) {
        currentFilterValues.value = [value] 
    }
    return {currentFilterValues, handleMultipleFilterClicked, handleSingleFilterClicked}
}