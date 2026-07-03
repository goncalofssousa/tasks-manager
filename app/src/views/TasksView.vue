<script setup lang="ts">
import { computed, ref} from 'vue'
import { useTasksStore } from '../stores/tasks'
import { Search, CircleCheckBig  } from 'lucide-vue-next'
import TaskModal  from '../components/TaskModal.vue'
import TaskCard from '../components/TaskCard.vue'
import type { Filter } from '../types/filter.ts'
import Filters from '../components/Filters.vue'
import type { Task } from '../types/tasks.ts'
import Message from '../components/Message.vue'
import ConfirmModal from '../components/ConfirmModal.vue'


const store = useTasksStore()

// Filters 
const filters: Filter[] = [
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' }
]
const search = ref('')
const currentFilterValues = ref<string[]>(['all'])

function handleFilterClicked(value: string) {
  currentFilterValues.value = [value]
}

const filteredMainTasks = computed(() => {
  const searchText = search.value.toLowerCase()

  return store.mainTasks
    .filter(t => {
      if (!t.title.toLowerCase().includes(searchText))
        return false

      if (currentFilterValues.value.includes('active'))
        return !t.done

      if (currentFilterValues.value.includes('done'))
        return t.done

      return true
    })
})

// actions 

function newTask(){
  editingTask.value = null 
  mainTaskId.value = null
  mode.value = 'create'
  showTaskModal.value = true
}

function addSubTask(taskId: number){
  editingTask.value = null
  mode.value = 'new-sub-task'
  mainTaskId.value = taskId
  showTaskModal.value = true
}

function editTask(task: Task){
  if(!task) return 
  editingTask.value = task
  mode.value = 'edit'
  mainTaskId.value = null
  showTaskModal.value = true
}

function markAsDone(id: number){
  store.markAsDone(id)
  openMessage('success', 'Task completed sucessfully')
} 

function markAsUnDone(id: number){
  store.markAsUnDone(id)
  openMessage('success', 'Task reopened sucessfully')
} 

function removeTask(id: number){
  taskToRemove.value = id
  showConfirmModal.value = true
} 


// TaskModal
const showTaskModal = ref<boolean>(false)
const mode = ref<'create' | 'edit' | 'new-sub-task'>('create')
const editingTask = ref<Task | null>(null)
const mainTaskId = ref<number | null>(null)

function handleSubmit(task: {
                        title: string, 
                        descricao: string, 
                        dueDate: string, 
                        parentId?: number
                      }){
  if(mode.value === 'edit' && editingTask.value !== null){
    store.updateTask(editingTask.value.id, task)
    openMessage('success', `Task edited sucessfully`)
  } else {
    store.addTask(task.title, task.descricao, task.dueDate, task.parentId)
    openMessage('success', `Task ${task.title} added sucessfully`)
  }
  closeTaskModal()
}

function closeTaskModal(){
  mode.value = 'create'
  editingTask.value = null
  showTaskModal.value = false
}

// ConfirmModal
const showConfirmModal = ref<boolean>(false)
const taskToRemove = ref<number | null>(null)

function closeConfirmModal(){
  taskToRemove.value = null
  showConfirmModal.value = false
}

function confirmDeleteTask(){
  if(!taskToRemove.value) return
  store.removeTask(taskToRemove.value)
  closeConfirmModal()
  openMessage('success', 'Task removed sucessfully')
}


//messages
const showMsg = ref(false)
const msgType = ref<'success' | 'error' | 'cancel'>('success')
const msgText = ref('')

function openMessage(type: typeof msgType.value,text: string) {
  msgType.value = type
  msgText.value = text
  showMsg.value = true

  setTimeout(() => {showMsg.value = false}, 2500)
}
</script>

<template>
  <div class="page">

    <div class="header">

      <h1>Tasks</h1>

      <button class="add-task-btn" @click="newTask">
        + Add Task
      </button>

    </div>

    <div class="search-bar">
      <Search class="icon-search"/>
      <input id="search" v-model="search" type="text" placeholder="Search tasks..."/>
    </div>

    <TaskModal 
      :show="showTaskModal" 
      :mode="mode" 
      :task="editingTask !== null ? editingTask : undefined"   
      :main-task-id="mainTaskId !== null ? mainTaskId : undefined"
      @submit="handleSubmit"    
      @close="closeTaskModal"
    />
  
    <Filters :all-filters="filters" :current-filter-values="currentFilterValues" @clicked-filter="handleFilterClicked"/>

    <div v-if="filteredMainTasks.length === 0" class="empty-state">
      <CircleCheckBig :size="40" />
      <p>Enjoy the free time — no tasks yet</p>
    </div>

    <TaskCard 
      v-else
      v-for="task in filteredMainTasks" 

      :key="task.id" 
      :task="task" 
      :subTasks="store.subTasksMap[task.id] || []"  

      @done="markAsDone"   
      @delete="removeTask" 
      @edit="editTask" 
      @undone="markAsUnDone"
      @add-sub-task="addSubTask"
    />
    
    <Message :show="showMsg" :type="msgType" :msg="msgText" @close="showMsg = false"/>
    <ConfirmModal :show="showConfirmModal" :title="'Delete task'" @cancel="closeConfirmModal" @confirm="confirmDeleteTask" />

  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
}

.header h1 {
  margin: 0;
}

/* ADD BUTTON */
.add-task-btn {
  width: auto;
  padding: 8px 12px;

  border: none;
  border-radius: 10px;

  background: var(--color-accent);
  color: white;

  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;

  transition: all .2s ease;

  display: flex;
  align-items: center;
  gap: 6px;
}

.add-task-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.15);
}

.add-task-btn:active {
  transform: translateY(0);
}

.search-bar {
  width: 100%;
  height: 4rem; 
  display: flex;
  align-items: center;

  gap: 5px;

  padding: 10px 14px;
  margin: 10px 0 20px;

  background: var(--color-primary-dark);

  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.06);

  transition: all .2s ease;
}

.icon-search {
  height: 25px;
  width: 25px;
  flex-shrink: 0;
} 

.search-bar:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(121,111,246,.15);
}

.search-bar:hover {
  border-color: rgba(121,111,246,.4);
}

.search-bar input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: var(--color-light);

  font-size: .95rem;
  font-family: Poppins, sans-serif;
}

.search-bar input::placeholder {
  color: var(--color-text-secondary);
  opacity: .8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  margin-top: 10%;

  color: var(--color-text-secondary);
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 480px) {
  .search-bar {
    height: 3rem;
  }

  .icon-search {
    height: 20px;
    width: 20px;
  }
}
</style>