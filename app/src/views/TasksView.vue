<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useTasksStore, type Task } from '../stores/tasks'
import { Search } from 'lucide-vue-next'
import TaskModal  from '../components/TaskModal.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskFilters from '../components/TaskFilters.vue'

const store = useTasksStore()

const search = ref('')

const filter = ref<'all' | 'active' | 'done'>('all')

const showModal = ref(false)
const mode = ref<'create' | 'edit' | 'new-sub-task'>('create')
const editingTask = ref<Task | null>(null)
const mainTaskId = ref<number | null>(null)


onMounted(() => store.load())

const filteredTasks = computed(() => {
  const searchText = search.value.toLowerCase()

  const tasks = filter.value === 'active' ? store.unDoneTaks : filter.value === 'done' ? store.completeTasks : store.tasks

  return tasks.filter(task => task.title.toLowerCase().includes(searchText))
})


const mainTasks = computed(() => {
  return filteredTasks.value.filter(t => t.parentId === undefined)
})

function setFilter(value: 'all' | 'active' | 'done') {
  filter.value = filter.value === value ? 'all' : value
}

function newTask(){
  editingTask.value = null 
  mainTaskId.value = null
  mode.value = 'create'
  showModal.value = true
}


function addSubTask(taskId: number){
  editingTask.value = null
  mode.value = 'new-sub-task'
  mainTaskId.value = taskId
  showModal.value = true
}


function editTask(task: Task){
  if(!task) return 
  editingTask.value = task
  mode.value = 'edit'
  mainTaskId.value = null
  showModal.value = true
}

function getSubTasks(taskId: number) {
  return filteredTasks.value.filter(
    t => t.parentId === taskId
  )
}

function handleSubmit(task: {
                        title: string, 
                        descricao: string, 
                        dueDate: string, 
                        parentId?: number
                      }){
  if(mode.value === 'edit' && editingTask.value !== null){
    store.updateTask(editingTask.value.id, task)
  } else {
    store.addTask(task.title, task.descricao, task.dueDate, task.parentId)
  }
  closeModal()
}

function closeModal(){
  mode.value = 'create'
  editingTask.value = null
  showModal.value = false
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
      <Search />
      <input v-model="search" type="text" placeholder="Search tasks..."/>
    </div>

    <TaskModal 
      :show="showModal" 
      :mode="mode" 
      :task="editingTask !== null ? editingTask : undefined"   
      :main-task-id="mainTaskId !== null ? mainTaskId : undefined"
      @submit="handleSubmit"    
      @close="closeModal"
    />
  
    <TaskFilters :filter="filter" @update-filter="setFilter"/>

    <TaskCard 
      v-if="mainTasks.length > 0" 
      v-for="task in mainTasks" 

      :key="task.id" 
      :task="task" 
      :subTasks="getSubTasks(task.id)"  

      @done="store.markAsDone" 
      @delete="store.removeTask" 
      @edit="editTask" 
      @undone="store.markAsUnDone"
      @add-sub-task="addSubTask"
    />

    <p v-else class="empty-state">
      No Tasks for today!
    </p>

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
  width: 100%;
  margin-top: 10%;

  text-align: center;

  color: var(--color-text-secondary);

  font-size: 1.2rem;
  font-weight: 500;
}
</style>