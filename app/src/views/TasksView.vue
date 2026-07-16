<script setup lang="ts">
import { computed, ref} from 'vue'
import { useTasksStore } from '../stores/tasks'
import { Search, CircleCheckBig, FilterIcon, X, SearchX, Plus  } from 'lucide-vue-next'
import TaskModal  from '../components/TaskModal.vue'
import TaskCard from '../components/TaskCard.vue'
import type { Priority, Task } from '../types/tasks.ts'
import Message from '../components/Message.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useMessage } from '../composables/useMessage.ts'
import '../styles/empty-state.css'
import FilterPanel from '../components/FilterPanel.vue'
import { useTaskFilters } from '../composables/useTaskFilters.ts'
import { useTaskModal } from '../composables/useTaskModal.ts'

const store = useTasksStore()
const {show, text, type, openMessage} = useMessage()

// Filters 
const showFilters = ref(false)

const { 
  filtersValue,
  handleFilterClick, 
  resetFilters,
  filterOptions, 
  activeFilterChips,
  removeFilterChip,
  matches,
  hasActiveFilters
} = useTaskFilters()


const search = ref('')

const filteredMainTasks = computed(() => {
  const searchText = search.value.toLowerCase()

  return store.mainTasks
    .filter(t => {
      if (!t.title.toLowerCase().includes(searchText)) return false

      return matches(t)
    })
})

// TaskModal
const {
  showTaskModal,
  mode,
  editingTask,
  mainTaskId,
  newTask,
  addSubTask,
  editTask,
  closeTaskModal
} = useTaskModal()

function handleSubmit(task: {
                        title: string, 
                        descricao: string, 
                        dueDate: string, 
                        parentId?: number
                        priority?: Priority
                      }){
  if(mode.value === 'edit' && editingTask.value !== null){
    store.updateTask(editingTask.value.id, task)
    openMessage('success', `Task edited sucessfully`)
  } else {
    store.addTask(task.title, task.descricao, task.dueDate, task.parentId, task.priority)
    openMessage('success', `Task ${task.title} added sucessfully`)
  }
  closeTaskModal()
}

function cancelTaskCreation(msg: string){
  closeTaskModal()
  openMessage("cancel", msg)
}

function markAsDone(id: number){
  store.markAsDone(id)
  openMessage('success', 'Task completed sucessfully')
} 

function markAsUnDone(id: number){
  store.markAsUnDone(id)
  openMessage('success', 'Task reopened sucessfully')
} 

function removeTask(id: number) {
  taskToRemove.value = id
  showConfirmModal.value = true
}

function toggleFavourite(id: number){
  store.toggleFavourite(id)
}

// ConfirmModal
const showConfirmModal = ref<boolean>(false)
const taskToRemove = ref<number | null>(null)

function closeConfirmModal(){
  taskToRemove.value = null
  showConfirmModal.value = false
}

function cancelOperation(msg: string){
  closeConfirmModal()
  openMessage("cancel", msg)
}

function confirmDeleteTask(){
  if(!taskToRemove.value) return
  store.removeTask(taskToRemove.value)
  closeConfirmModal()
  openMessage('success', 'Task removed sucessfully')
}

const menuOpen = ref<boolean>(false)

function handleMenuOpened(){
  menuOpen.value = true
} 

function handleMenuClosed(){
  menuOpen.value = false 
}
</script>

<template>
  <div class="page">

    <div class="header">
      <h1>Tasks</h1>

      <button class="add-task-btn" @click="newTask">
        <Plus :size="16"/>
        Add Task
      </button>
    </div>

    <div class="search-bar">
      <Search class="icon-search"/>
      <input id="search" v-model="search" type="text" placeholder="Search tasks..."/>
    </div>  
    
    <div class="task-toolbar">
      <button class="filter-btn" :class="{ active: hasActiveFilters }" @click="showFilters = !showFilters">
        <FilterIcon :size="16"/>
        Filters
        <span v-if="hasActiveFilters" class="filter-count">{{ activeFilterChips.length }}</span>
      </button>

      <div v-if="hasActiveFilters" class="active-chips">
        <button v-for="(chip, value) in activeFilterChips" :key="chip" class="chip" @click="removeFilterChip(value)">
          {{ chip.charAt(0).toUpperCase() + chip.slice(1) }}
          <X :size="12" />
        </button>

        <button class="clear-all" @click="resetFilters">
          Clear all
        </button>
      </div>
    </div>

    <FilterPanel
      :show="showFilters"
      :filters="filterOptions"
      :model-value="filtersValue"

      @close="showFilters=false"
      @toggle-filter="handleFilterClick"
      @reset="resetFilters"
    />

    <div v-if="filteredMainTasks.length === 0 && hasActiveFilters" class="empty-state">
      <SearchX :size="40" />
      <p>No tasks match these filters</p>
    </div>

    <div v-else-if="filteredMainTasks.length === 0" class="empty-state"> 
      <CircleCheckBig :size="40" />
      <p>Enjoy the free time — no tasks yet</p>
    </div>
    
    <TaskCard 
      v-else
      v-for="task in filteredMainTasks" 

      :key="task.id" 
      :task="task" 
      :subTasks="store.subTasksMap[task.id] || []"  
      :menu-open="menuOpen"

      @done="markAsDone"   
      @delete="removeTask" 
      @edit="editTask" 
      @undone="markAsUnDone"
      @add-sub-task="addSubTask"
      @toggle-favourite="toggleFavourite"
      @opened-menu="handleMenuOpened"
      @closed-menu="handleMenuClosed"

      class="task-card"
    />
    
    <TaskModal 
      :show="showTaskModal" 
      :mode="mode" 
      :task="editingTask !== null ? editingTask : undefined"   
      :main-task-id="mainTaskId !== null ? mainTaskId : undefined"
      @submit="handleSubmit"    
      @close="cancelTaskCreation('Task creation cancelled')"
    />
    <Message :show="show" :type="type" :msg="text" @close="show = false"/>
    <ConfirmModal :show="showConfirmModal" :title="'Delete task'" @cancel="cancelOperation('Task delete operation cancelled')" @confirm="confirmDeleteTask" />

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

/* ADD BUTTON */
.add-task-btn {
  width: auto;
  padding: 8px 14px;

  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;

  background: #27272a;
  color: #fafafa;

  font-size: .85rem;
  font-weight: 500;

  cursor: pointer;

  transition: all .2s ease;

  display: flex;
  align-items: center;
  gap: 6px;
}

.add-task-btn:hover {
  transform: translateY(-1px);
  background: #3f3f46;
  border-color: rgba(255,255,255,.18);
}

.add-task-btn:active {
  transform: translateY(0);
}

.search-bar {
  width: 100%;
  height: 4rem; 
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  padding: 10px 14px;
  margin: 10px 0 20px;

  background: #18181b;
  border: 1px solid rgba(255,255,255,.08);

  border-radius: 12px;

  transition: all .2s ease;
}

.icon-search {
  height: 25px;
  width: 25px;
  flex-shrink: 0;
} 


.search-bar:focus-within {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255,255,255,.08);
}

.search-bar:hover {
    border-color: rgba(255,255,255,.2);
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

.task-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 16px;
}


.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 14px;

  border-radius: 10px;

  background: #18181b;
  border: 1px solid rgba(255,255,255,.08);
  color: #a1a1aa;

  font-family: Poppins, sans-serif;
  font-size: .85rem;
  font-weight: 600;

  cursor: pointer;

  transition: all .2s ease;
}


.filter-btn:hover {
  border-color: white;
  color: white;
}

.filter-btn.active {
  background: rgba(255,255,255,.08);
  border-color: white;
  color: white;
}

.filter-count {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 16px;
  height: 16px;
  padding: 0 4px;

  border-radius: 999px;
  background: var(--color-accent);
  color: white;

  font-size: .7rem;
  font-weight: 700;
}

.active-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;

  border-radius: 999px;

  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: white;

  font-family: Poppins, sans-serif;
  font-size: .8rem;
  font-weight: 600;

  cursor: pointer;
  transition: all .2s ease;
}

.chip:hover {
  background: rgba(255,255,255,.12);
}

.clear-all {
  padding: 6px 4px;

  border: none;
  background: transparent;

  color: var(--color-text-secondary);

  font-family: Poppins, sans-serif;
  font-size: .8rem;
  font-weight: 600;

  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  transition: color .2s ease;
}

.clear-all:hover {
  color: var(--color-light);
}

.task-card {
  margin-bottom: 16px;
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