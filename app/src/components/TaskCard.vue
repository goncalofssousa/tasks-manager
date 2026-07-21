<script setup lang="ts">
import type { Task } from '../types/tasks'
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import {
  ChevronDown,
  EllipsisVertical,
  Calendar,
  Star,
} from 'lucide-vue-next'

import SubTaskCard from './SubTaskCard.vue'
import { useTaskState } from '../composables/useTaskState.ts'
import '../styles/task-ui.css'
import TaskOptionsMenu from './TaskOptionsMenu.vue'


const props = defineProps<{
  task: Task
  subTasks: Task[]
  menuOpen: boolean
  compact: boolean
}>()

const emit = defineEmits([
  'done',
  'undone',
  'delete',
  'edit',
  'addSubTask',
  'toggleFavourite',
  'openedMenu',
  'closedMenu'
])


// subtasks

const showSubTasks = ref(false)

function toggleSubTasks() {
  showSubTasks.value = !showSubTasks.value
}

const completedSubTasks = computed(() =>
  props.subTasks.filter(t => t.done).length
)

const progress = computed(() =>
  props.subTasks.length === 0 ? 0 : (completedSubTasks.value / props.subTasks.length) * 100
)

// priotiy class
const priorityClass = computed(() => {
  if (!props.task.priority) return ''

  return `priority-${props.task.priority.toLowerCase()}`
})

// task state 
const { dueState, timeSinceOverdue } = useTaskState(props.task)


// options 

const showOptions = ref(false)

function toggleOptions() {
  showOptions.value = !showOptions.value
  if(showOptions.value) emit('openedMenu')
  else emit('closedMenu')
}

const button = ref()
const menu = ref()

onClickOutside(menu, () => {
  showOptions.value = false
  emit('closedMenu')
}, {
  ignore: [button]
})

function editTask() {
  toggleOptions()
  emit('edit', props.task)
}

function deleteTask() {
  toggleOptions()
  emit('delete', props.task.id)
}

function markAsDone() {
  toggleOptions()
  emit('done', props.task.id)
}

function markAsUndone() {
  toggleOptions()
  emit('undone', props.task.id)
}

function addSubTask() {
  toggleOptions()
  emit('addSubTask', props.task.id)
}

function toggleFavourite(){
  emit('toggleFavourite', props.task.id)
}
</script>


<template>

<div class="card" :class="{ 'disabled': menuOpen, 'completed': task.done }">
  <div class="header">
    <div class="title-wrapper">
      <h3 class="title" :class="{ 'completed': task.done }">
        {{ task.title }}
      </h3>

      <span v-if="task.priority || task.done" class="priority-badge" :class="{ [priorityClass]: !task.done, 'priority-completed': task.done }">
        {{ !task.done ? `${task.priority} Priority` : 'Completed' }}
      </span>
    </div>

    <div class="all-actions">
      <button class="icon-btn" :class="{'favourite': task.favourite}" @click="toggleFavourite">
        <Star   :fill="task.favourite ? 'currentColor' : 'none'"
                :stroke-width="2" :size="20"/>
      </button>

      <div class="task-actions" :class="{ 'completed': task.done }">
        <button ref="button" class="icon-btn" @click="toggleOptions">
          <EllipsisVertical :size="25"/>
        </button>

        <TaskOptionsMenu
          ref="menu"
          :show="showOptions"
          :add-sub-task="true"
          :task-done="task.done"
          @edit="editTask"
          @delete="deleteTask"
          @markDone="markAsDone"
          @markUndone="markAsUndone"
          @addSubTask="addSubTask"
        />
      </div>
    </div>
  </div>

  <p v-if="task.descricao" class="description" :class="{'completed': task.done}">
    {{ task.descricao }}
  </p>

  <div class="date" :class="dueState">
    <div class="date-content">
      <Calendar :size="12" />

      <p v-if="dueState !== 'done'">
        <strong>Due Date:</strong>
        {{ task.dueDate || 'No date' }}
      </p>

      <p v-else>
        <strong>Completed on:</strong>
        {{ task.doneDate }}
      </p>
    </div>

    <p v-if="timeSinceOverdue" class="warning overdue-warning">
      ⚠ {{ timeSinceOverdue }}
    </p>

    <p v-else-if="dueState === 'today'" class="warning today-warning">
      ⚠ Due today
    </p>
  </div>


  <div v-if="subTasks.length && !compact" class="progress-wrapper">
    <div class="progress-header">
      <div class="progress-text">
        Subtasks:
        {{ completedSubTasks }}
        /
        {{ subTasks.length }}
      </div>

      <button class="toggle-btn" @click="toggleSubTasks">
        <ChevronDown :size="16" class="chevron" :class="{ rotated: showSubTasks }"/>
        <span class="toggle-text">
          {{ showSubTasks ? 'Hide' : 'See' }}
        </span>

      </button>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"/>
    </div>
  </div>

  <div v-if="subTasks.length && showSubTasks && !compact" class="subtasks">
    <SubTaskCard
      v-for="sub in subTasks"
      :key="sub.id"
      :sub-task="sub"

      @done="$emit('done', sub.id)"
      @undone="$emit('undone', sub.id)"
      @delete="$emit('delete', sub.id)"
      @edit="$emit('edit', sub)"
    />
  </div>
</div>


</template>


<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;

  padding: 18px;

  border-radius: 14px;

  background: var(--color-primary-dark);

  border: 1px solid rgba(255,255,255,.08);
  border-left: 3px solid rgba(255,255,255,.12);

  box-sizing: border-box;

  transition: .2s ease;
}

.card:not(.disabled):hover {
  transform: translateY(-2px);

  border-color: rgba(255,255,255,.18);
  border-left-color: rgba(255,255,255,.35);

  box-shadow:
    0 0 12px rgba(255,255,255,.05),
    0 0 24px rgba(255,255,255,.03);
}


/* TASK STATES */

.card.completed {
  border-left-color: #22c55e;
}

.card.completed:not(.disabled):hover {
  border-color: rgba(255,255,255,.18);
  box-shadow: -2px 0 14px -6px rgba(34,197,94,.35);
}


.header {
  display:flex;

  justify-content:space-between;

  align-items:center;

  width:100%;
}


.title-wrapper {
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
}

.title {
  margin:0;
  color:white;
  font-size:1.2rem;
  font-weight:600;
}

.title.completed {
  color: var(--color-text-secondary);
}

.description {
  margin:0;
  color:var(--color-text-secondary);
  font-size:.88rem;
  line-height:1.5;
}


/* PRIORITY */
.priority-badge {
  padding:3px 10px;
  border-radius:999px;
  font-size:.65rem;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
}

.priority-high {
  color:#ef4444;
  background:rgba(239,68,68,.12);
}
.priority-medium {
  color:#f59e0b;
  background:rgba(245,158,11,.12);
}

.priority-low {
  color:#3b82f6;
  background:rgba(59,130,246,.12);
}

.priority-completed {
  color:#22c55e;
  background:rgba(34,197,94,.12);
}

/* PROGRESS */

.progress-wrapper {
  width:100%;
}

.progress-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
}

.progress-text {
  font-size:.75rem;
  color:var(--color-text-secondary);
}

.progress-bar {
  width:100%;
  height:6px;
  background:rgba(255,255,255,.06);
  border-radius:999px;
  overflow:hidden;
}

.progress-fill {
  height:100%;
  background:var(--color-accent);
  transition:.3s ease;
}

.toggle-btn {
  background:none;
  border:none;
  color:var(--color-text-secondary);
  display:flex;
  align-items:center;
  gap:4px;
  cursor:pointer;
}

.toggle-btn:hover {
  color: var(--color-accent)
}

.chevron {
  transition:.25s;
}


.chevron.rotated {
  transform:rotate(180deg);
}

.all-actions  {
  display: flex;
  flex-direction: row;
}


/* SUBTASKS */

.subtasks {
  display:flex;
  flex-direction:column;
  gap:8px;
  width:100%;
  padding-left:14px;
  border-left:2px solid rgba(255,255,255,.08);
}
</style>