import { ref } from "vue";
import { computed, type Ref } from "vue";

// Ref representa uma referencia reativa do Vue. "T" usado para admitir um certo tipo T, assim o composable pode ser reutilizador para tasks paginadas, historico etc
export function usePagination<T>(items: Ref<T[]>, itemsPerPage: number){
    const page = ref<number>(1)
    
    const totalPages = computed(() => {
        return Math.ceil(items.value.length / itemsPerPage)
    })

    function nextPage(){
        if(page.value < totalPages.value) page.value++; 
    }

    function prevPage(){
        if(page.value > 1) page.value--;       
    }

    const paginated = computed(() => {
        const startIndex = (page.value - 1) * itemsPerPage
        const endIndex = page.value * itemsPerPage
        return items.value.slice(startIndex, endIndex)
    })

    return {
        page,
        totalPages,
        nextPage,
        prevPage,
        paginated
    }
}