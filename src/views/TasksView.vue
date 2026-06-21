<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { Search } from 'lucide-vue-next'
import Modal from '../components/Modal.vue'
import TaskCard from '../components/TaskCard.vue'
import TaskFilters from '../components/TaskFilters.vue'

const store = useTasksStore()

const filter = ref<'all' | 'active' | 'done'>('all')
const newTask = ref('')
const showModal = ref(false)
const search = ref('')

onMounted(() => store.load())

const canSend = computed(() => {
  return newTask.value.trim() !== ''
})

const filtered = computed(() => {
  if (filter.value === 'active') return store.unDoneTaks.filter(t => t.descricao.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))
  if (filter.value === 'done') return store.completeTasks.filter(t => t.descricao.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))
  return store.tasks.filter(t => t.descricao.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))
})

function setFilter(value: 'all' | 'active' | 'done') {
  filter.value = filter.value === value ? 'all' : value
}

function createTask(){
  store.addTask(newTask.value)
  newTask.value = ''
  showModal.value = false
}
</script>

<template>
  <div class="page">

    <div class="header">

      <h1>Tasks</h1>

      <button class="add-task-btn" @click="showModal = true">
        + Add Task
      </button>

    </div>

    <div class="search-bar">
      <Search />
      <input v-model="search" type="text" placeholder="Search tasks..." />
    </div>

    <Modal :show="showModal" @close="showModal = false">

      <h2>New Task</h2>

      <input v-model="newTask" placeholder="Write your task..." />

      <div class="modal-actions">

        <button class="modal-btn cancel" @click="showModal = false">
          Cancel
        </button>

        <button class="modal-btn confirm" @click="createTask" :disabled="!canSend">
          Add
        </button>

      </div>

    </Modal>

    <TaskFilters :filter="filter" @update-filter="setFilter"/>

    <TaskCard v-if="filtered.length > 0" v-for="task in filtered" :key="task.id" :task="task" @done="store.markAsDone" @delete="store.removeTask"/>
    <p v-else class="empty-state">No Tasks for today! </p>

  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}


/* HEADER LAYOUT */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
}

.header h1 {
  margin: 0;
}

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

  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  gap: 6px;
}

.add-task-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.15);
}

.add-task-btn:active {
  transform: translateY(0px);
}

.search-bar {
  width: 100%;
  display: flex;
  align-items: center;

  gap: 5x;

  padding: 10px 14px;

  margin: 10px 0 20px;

  background: var(--color-primary-dark);
  border-radius: 12px;

  border: 1px solid rgba(255, 255, 255, 0.06);

  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(121, 111, 246, 0.15);
}

.search-bar input {
  flex: 1;

  background: transparent;
  border: none;
  outline: none;

  color: var(--color-light);
  font-size: 0.95rem;

  font-family: Poppins, sans-serif;
}

/* placeholder */
.search-bar input::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.8;
}

/* icon (lupa) */
.search-bar .icon {
  width: 18px;
  height: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--color-text-secondary);
  opacity: 0.8;
}

/* hover subtil */
.search-bar:hover {
  border-color: rgba(121, 111, 246, 0.4);
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;

  margin-top: 12px;
}

.modal-btn {
  padding: 10px 14px;
  border-radius: 10px;

  border: none;

  font-weight: 600;
  font-size: 0.95rem;

  cursor: pointer;

  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: transparent;
  color: var(--color-text-secondary);
}

.modal-btn.cancel:hover {
  color: white;
  transform: translateY(-1px);
}

.modal-btn.confirm {
  background: var(--color-accent);
  color: white;

  box-shadow: 0 10px 20px rgba(121, 111, 246, 0.25);
}

.modal-btn.confirm:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.modal-btn.confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.modal input {
  width: 100%;
  padding: 10px;

  border: none;
  outline: none;

  border-radius: 10px;

  background: var(--color-primary);
  color: white;
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