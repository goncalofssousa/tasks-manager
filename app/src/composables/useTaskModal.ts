import { ref } from "vue"
import type { Task } from "../types/tasks"

export function useTaskModal() {
    const showTaskModal = ref(false)
    const showConfirmModal = ref(false)

    const editingTask = ref<Task | null>(null)
    const taskToRemove = ref<number | null>(null)
    const mainTaskId = ref<number | undefined>(undefined)

    const mode = ref<'create' | 'edit' | 'new-sub-task'>('create')
    

    function newTask() {
        editingTask.value = null
        mainTaskId.value = undefined
        mode.value = 'create'
        showTaskModal.value = true
    }

    function addSubTask(taskId: number) {
        editingTask.value = null
        mainTaskId.value = taskId
        mode.value = 'new-sub-task'
        showTaskModal.value = true
    }

    function editTask(task: Task) {
        editingTask.value = task
        mainTaskId.value = task.parentId
        mode.value = 'edit'
        showTaskModal.value = true
    }

    function closeTaskModal(){
        mode.value = 'create'
        editingTask.value = null
        showTaskModal.value = false
    }

    return {
        showTaskModal,
        showConfirmModal,
        editingTask,
        taskToRemove,
        mainTaskId,
        mode,

        newTask,
        addSubTask,
        editTask,
        closeTaskModal
    }
}