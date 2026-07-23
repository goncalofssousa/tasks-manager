<script setup lang="ts">
import { computed, ref} from 'vue'
import { useTasksStore } from '../stores/tasks'
import { Search, FilterIcon, X, Plus, ArrowDownUp, Tags } from 'lucide-vue-next'
import TaskModal  from '../components/TaskModal.vue'
import type { Priority, TaskComparator } from '../types/tasks.ts'
import Message from '../components/Message.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useMessage } from '../composables/useMessage.ts'
import { useTaskFilters } from '../composables/useTaskFilters.ts'
import { useTaskModal } from '../composables/useTaskModal.ts'
import TaskSection from '../components/TaskSection.vue'
import TaskFilterMenu from '../components/TaskFilterMenu.vue'
import TaskSortMenu from '../components/TaskSortMenu.vue'
import { compareTasksDate, compareTasksPriority, compareTasksTitle } from '../utils/taskUtils.ts'
import { onClickOutside } from '@vueuse/core'

const store = useTasksStore()
const {show, text, type, openMessage} = useMessage()

// Filters && search
const search = ref('')
const showFilters = ref(false)
const filterMenu = ref()
const filterButton = ref()


onClickOutside(filterMenu, () => {
  showFilters.value = false
}, {
  ignore: [filterButton]
})

const {
  filtersValue,
  hasActiveFilters,
  activeFilters,
  handleFilterClick,
  resetFilters,
  filterOptions,
  removeFilter,
  matches,
} = useTaskFilters()


function filterTasks(tasks: typeof store.mainTasksActive) {
  const searchText = search.value.toLowerCase()
  return tasks.filter(t => t.title.toLowerCase().includes(searchText) && matches(t))
}

const filteredMainTasksActive = computed(() => 
  filterTasks(store.mainTasksActive).sort(sortOptions[sortOptionSelected.value].function)
)
  
const filteredMainTasksDone = computed(() => 
  filterTasks(store.mainTasksDone).sort((a,b) =>  new Date(a.doneDate ?? '').getTime() -  new Date(b.doneDate ?? '').getTime())
)

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


// Confirm Modal
const showConfirmModal = ref<boolean>(false)
const taskToRemove = ref<number | null>(null)

function handleRemoveClick(id: number) {
  taskToRemove.value = id
  showConfirmModal.value = true
}

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

// Sort 
const showSortMenu = ref<boolean>(false)

const sortMenu = ref()
const sortButton = ref()

onClickOutside(sortMenu, () => {
  showSortMenu.value = false
}, {
  ignore: [sortButton]
})


const sortOptions: Record<string, TaskComparator> = {
  'priority': {label: 'Priority', function: compareTasksPriority}, 
  'title': {label: 'Title (A-Z)', function: compareTasksTitle},
  'dueDate': {label: 'Due Date', function: compareTasksDate}
}

const sortOptionSelected = ref<string>('priority')

function handleToggleSort(key: string){
  sortOptionSelected.value = key
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

    <div class="toolbar">
      <div class="search-bar">
        <Search class="icon-search" :size="18"/>
        <input id="search" v-model="search" type="text" placeholder="Search tasks..."/>
      </div>

      <div class="sort-info">
        <span class="sort-label">Sorted By</span>
        <span class="sort-value">{{ sortOptions[sortOptionSelected].label }}</span>
      </div>

      <div class="action-anchor">
        <div class="action-group">
          <button ref="sortButton" class="action-btn" :class="{ active: showSortMenu }" @click="showSortMenu = !showSortMenu">
            <ArrowDownUp :size="16"/>
            <span class="action-label">Sort</span>
          </button>
          <button ref="filterButton" class="action-btn" :class="{ active: showFilters }" @click="showFilters = !showFilters">
            <FilterIcon :size="16"/>
            <span class="action-label">Filters</span>
          </button>
          <button class="action-btn">
            <Tags :size="16"/>
            <span class="action-label">Tags</span>
          </button>
        </div>

        <TaskFilterMenu
          ref="filterMenu"
          :show="showFilters"
          :filters="filterOptions"
          :model-value="filtersValue"
          @close="showFilters=false"
          @toggle-filter="handleFilterClick"
          @reset="resetFilters"
        />

        <TaskSortMenu
          ref="sortMenu"
          :show="showSortMenu"
          :sort-options="sortOptions"
          :model-value="sortOptionSelected"
          @close="showSortMenu = false"
          @toggle-sort="handleToggleSort"
        />
      </div>
    </div>

    <div v-if="hasActiveFilters" class="active-chips-container">
      <button v-for="(activeFilter, index) in activeFilters" :key="index" class="chip" @click="removeFilter(activeFilter.group, activeFilter.value)">
        {{ activeFilter.label }}
        <X :size="12" />
      </button>
    </div>

    <TaskSection
      :title="'Pending'"
      :tasks="filteredMainTasksActive"
      :has-active-filters="hasActiveFilters || search.length > 0"
      :section = "'pending'"

      @edit-task="editTask"
      @add-sub-task="addSubTask"
      @remove-task="handleRemoveClick"
      @message="openMessage"
    />

    <TaskSection
      v-if="filteredMainTasksDone.length > 0"
      :title="'Completed'"
      :tasks="filteredMainTasksDone"
      :has-active-filters="hasActiveFilters || search.length > 0"
      :section = "'completed'"
      @edit-task="editTask"
      @add-sub-task="addSubTask"
      @remove-task="handleRemoveClick"
      @message="openMessage"
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
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 16px;
}

/* ADD BUTTON */
.add-task-btn {
  width: auto;
  padding: 8px 14px;

  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;

  background: #27272a;
  color: #fafafa;

  font-family: Poppins, sans-serif;
  font-size: .85rem;
  font-weight: 500;

  cursor: pointer;

  transition: all .2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
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

/* TOOLBAR: search + actions in one cohesive row */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar {
  flex: 1;
  min-width: 0;
  height: 2.5rem;
  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 14px;

  background: #18181b;
  border: 1px solid rgba(255,255,255,.08);

  border-radius: 12px;

  transition: all .2s ease;
}

.icon-search {
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.search-bar:focus-within {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255,255,255,.08);
}

.search-bar:focus-within .icon-search {
  color: white;
}

.search-bar:hover {
  border-color: rgba(255,255,255,.2);
}

.search-bar input {
  flex: 1;
  min-width: 0;

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

/* SORT INFO */
.sort-info {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 6px 16px;
  height: 2.5rem;

  border-radius: 12px;
}

.sort-label {
  font-family: Poppins, sans-serif;
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--color-text-secondary);
}

.sort-value {
  font-family: Poppins, sans-serif;
  font-size: .95rem;
  font-weight: 600;
  color: var(--color-light);
}

/* ANCHOR for filters dropdown */
.action-anchor {
  position: relative;
  flex-shrink: 0;
}

/* Actions grouped together visually as one unit */
.action-group {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 4px;

  background: #18181b;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
}

.action-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 12px;
  height: 2rem;

  border-radius: 8px;

  background: transparent;
  border: none;
  color: #a1a1aa;

  font-family: Poppins, sans-serif;
  font-size: .85rem;
  font-weight: 600;

  cursor: pointer;

  transition: all .2s ease;
}

.action-btn:hover {
  background: rgba(255,255,255,.06);
  color: white;
}

.action-btn.active {
  background: rgba(255,255,255,.1);
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

.active-chips-container {
  display: flex;
  flex-direction: row;
  gap: 6px;

  margin-top: 12px;

  overflow-x: auto;
  overflow-y: hidden;

  white-space: nowrap;
  padding-bottom: 4px;
}

.active-chips-container::-webkit-scrollbar {
  height: 5px;
}

.active-chips-container::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.2);
  border-radius: 999px;
}

.active-chips {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}

.chip {
  flex-shrink: 0;

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
}

.chip:hover {
  background: rgba(255,255,255,.12);
  border-color: rgba(255,255,255,.24);
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

/* Transitions */
.chips-enter-active,
.chips-leave-active {
  transition: all .2s ease;
}

.chips-enter-from,
.chips-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.chip-enter-active,
.chip-leave-active {
  transition: all .18s ease;
}

.chip-enter-from,
.chip-leave-to {
  opacity: 0;
  transform: scale(.9);
}

.chip-leave-active {
  position: absolute;
}

@media (max-width: 640px) {
  .toolbar {
    flex-wrap: wrap;
  }

  .search-bar {
    flex: 1 1 100%;
    height: 3rem;
  }

  .sort-info {
    display: none;
  }

  .action-anchor {
    flex: 1;
  }

  .action-group {
    justify-content: space-between;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

}

@media (max-width: 420px) {
  .action-label {
    display: none;
  }

  .action-btn {
    padding: 8px;
  }
}
</style>