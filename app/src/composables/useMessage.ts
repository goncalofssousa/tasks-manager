import { ref } from 'vue'

export function useMessage(){
    const show = ref<boolean>(false)
    const text = ref<string>('')
    const type = ref<'success' | 'error' | 'cancel'>('success')


    function openMessage(msgType: typeof type.value, msgText: string) {
    type.value = msgType
    text.value = msgText
    show.value = true

    setTimeout(() => {show.value = false}, 2500)
    }

    return {show,text,type,openMessage}
}