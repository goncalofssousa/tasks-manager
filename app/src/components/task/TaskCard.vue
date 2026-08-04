<script setup lang="ts">
import type { Task } from '../../types/tasks.ts'
import { computed, inject, ref, type Ref } from 'vue'
import {
  ChevronDown,
  Star,
} from 'lucide-vue-next'

import SubTaskCard from './SubTaskCard.vue'
import TaskDate from './TaskDate.vue'
import TaskActions from './TaskActions.vue'

const taskMenu = inject<{
  menuOpen: Ref<boolean>
  setMenuOpen: (value: boolean) => void
}>('taskMenu')!

const isMenuOpen = computed(() => taskMenu.menuOpen.value)

const props = defineProps<{
  task: Task
  subTasks: Task[]
  compact: boolean
}>()

const emit = defineEmits([
  'done',
  'undone',
  'delete',
  'edit',
  'addSubTask',
  'toggleFavourite',
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
const stateClass = computed(() => {
  if(props.task.done) return 'completed'
  if (!props.task.priority) return ''

  return `priority-${props.task.priority.toLowerCase()}`
})


// options
function toggleFavourite(){
  emit('toggleFavourite', props.task.id)
}
</script>


<template>
<div class="card" :class="[stateClass, { 'disabled': isMenuOpen}]">
  <div class="header">
    <div class="title-wrapper">
      <h3 class="title" :class="{ 'completed': task.done }">
        {{ task.title }}
      </h3>

      <span v-if="task.priority || task.done" class="priority-badge" :class="stateClass">
        {{ !task.done ? `${task.priority} Priority` : 'Completed' }}
      </span>
    </div>

      <button class="icon-btn" :class="{'favourite': task.favourite}" @click="toggleFavourite">
        <Star  :fill="task.favourite ? 'currentColor' : 'none'" :stroke-width="2" :size="20"/>
      </button>

      <TaskActions 
        :task-done="task.done" 
        :add-sub-task="true" 
        @edit="emit('edit', task)"
        @mark-done="emit('done', task.id)"
        @mark-undone="emit('undone', task.id)"
        @delete="emit('delete', task.id)"
        @add-sub-task="emit('addSubTask', task.id)"
      />
  </div>

  <p v-if="task.descricao && !compact" class="description" :class="{'completed': task.done}">
    {{ task.descricao }}
  </p>

  <TaskDate v-if="task.dueDate || task.done" :task="task" /> 

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
        <span>
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

.header {
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  width:100%;
}

.title-wrapper {
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
  min-width:0;
  flex:1;
}

.title {
  margin:0;
  color:white;
  font-size:1.2rem;
  font-weight:600;
  overflow-wrap: break-word;
  word-break: break-word;
}


.description {
  margin:0;
  color:var(--color-text-secondary);
  font-size:.88rem;
  line-height:1.5;
  overflow-wrap: break-word;
  word-break: break-word;
}

.priority-badge {
  padding:3px 10px;
  border-radius:999px;
  font-size:.65rem;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
}

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

.subtasks {
  display:flex;
  flex-direction:column;
  gap:8px;
  width:100%;
  padding-left:14px;
  border-left:2px solid rgba(255,255,255,.08);
}

/* TASK STATES — cor única por estado, tudo o resto deriva daqui */

.card.priority-high {
  --priority-accent: var(--color-priority-high, #ef4444);
}
.card.priority-medium {
  --priority-accent: var(--color-priority-medium, #f59e0b);
}
.card.priority-low {
  --priority-accent: var(--color-priority-low, #3b82f6);
}
.card.completed {
  --priority-accent: var(--color-priority-completed, #22c55e);
}

.card.priority-high,
.card.priority-medium,
.card.priority-low,
.card.completed {
  border-left-color: color-mix(in srgb, var(--priority-accent) 50%, black);
}

.card.priority-high:not(.disabled):hover,
.card.priority-medium:not(.disabled):hover,
.card.priority-low:not(.disabled):hover,
.card.completed:not(.disabled):hover {
  border-color: rgba(255,255,255,.18);
  border-left-color: var(--priority-accent);

  box-shadow:
    0 0 12px rgba(255,255,255,.05),
    -2px 0 14px -6px color-mix(in srgb, var(--priority-accent) 65%, transparent);
}

.title.completed {
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

.priority-badge.priority-high {
  color: var(--color-priority-high, #ef4444);
  background: color-mix(in srgb, var(--color-priority-high, #ef4444) 12%, transparent);
}

.priority-badge.priority-medium {
  color: var(--color-priority-medium, #f59e0b);
  background: color-mix(in srgb, var(--color-priority-medium, #f59e0b) 12%, transparent);
}

.priority-badge.priority-low {
  color: var(--color-priority-low, #3b82f6);
  background: color-mix(in srgb, var(--color-priority-low, #3b82f6) 12%, transparent);
}

.priority-badge.completed {
  color: var(--color-priority-completed, #22c55e);
  background: color-mix(in srgb, var(--color-priority-completed, #22c55e) 12%, transparent);
}
</style>