<script setup lang="ts">
import type { Task } from '../types/tasks'
import { computed, ref } from 'vue'
import {
  Check,
  Pencil,
  Trash2,
  Calendar,
  RotateCcw,
  ChevronDown
} from 'lucide-vue-next'

import SubTaskCard from './SubTaskCard.vue'
import { useTaskState } from '../composables/useTaskState.ts'
import '../styles/task-ui.css'


const props = defineProps<{
  task: Task
  subTasks: Task[]
}>()

defineEmits([
  'done',
  'undone',
  'delete',
  'edit',
  'addSubTask'
])

const { dueState, timeSinceOverdue } = useTaskState(props.task)

const showSubTasks = ref(false)

const completedSubTasks = computed(() =>
  props.subTasks.filter(t => t.done).length
)

const progress = computed(() =>
  props.subTasks.length === 0
    ? 0
    : (completedSubTasks.value / props.subTasks.length) * 100
)

const priorityClass = computed(() => {
  if (!props.task.priority) return ''

  return `priority-${props.task.priority.toLowerCase()}`
})


const cardStateClass = computed(() => {
  if (props.task.done)
    return 'completed'

  if (dueState.value === 'overdue')
    return 'overdue'

  if (dueState.value === 'today')
    return 'today'

  return ''
})


function toggleSubTasks() {
  showSubTasks.value = !showSubTasks.value
}
</script>


<template>

<div class="card" :class="cardStateClass">

  <div class="header">
    <div class="title-wrapper">
      <h3 class="title">
        {{ task.title }}
      </h3>

      <span v-if="task.priority" class="priority-badge" :class="priorityClass">
        {{ task.priority }} Priority
      </span>
    </div>

    <div class="actions">
      <button v-if="!task.done" class="icon-btn complete" @click="$emit('done', task.id)">
        <Check :size="17"/>
      </button>

      <button v-if="!task.done" class="icon-btn edit" @click="$emit('edit', task)">
        <Pencil :size="17"/>
      </button>

      <button v-if="!task.done" class="icon-btn add-subtask" @click="$emit('addSubTask', task.id)">
        +
      </button>

      <button v-else class="icon-btn edit" @click="$emit('undone', task.id)">
        <RotateCcw :size="17"/>
      </button>

      <button class="icon-btn delete" @click="$emit('delete', task.id)">
        <Trash2 :size="17"/>
      </button>
    </div>
  </div>

  <p v-if="task.descricao" class="description">
    {{ task.descricao }}
  </p>

  <div class="date" :class="dueState">
    <Calendar :size="12"/>

    <p v-if="dueState !== 'done'">
      Due Date:
      {{ task.dueDate || 'No date' }}
    </p>

    <p v-else>
      Task Completed:
      {{ task.doneDate }}
    </p>

    <div v-if="timeSinceOverdue" class="warning overdue-warning">
      ⚠ {{ timeSinceOverdue }}
    </div>

    <div v-else-if="dueState === 'today'" class="warning today-warning">
      ⚠ Task due today
    </div>
  </div>


  <div v-if="subTasks.length" class="progress-wrapper">
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

  <div v-if="subTasks.length && showSubTasks" class="subtasks">
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

  background: var(--color-primary-dark);

  border-radius: 14px;

  border: 1px solid rgba(255,255,255,.06);
  border-left: 3px solid rgba(255,255,255,.12);

  box-sizing: border-box;

  transition: .2s ease;
}


/* TASK STATES */

.card.completed {
  opacity: .6;
  border-left-color: #22c55e;
  box-shadow: -2px 0 14px -6px rgba(34,197,94,.35);
  text-decoration: line-through;
}

.card.overdue {
  border-left-color: #ef4444;
  box-shadow:
    -2px 0 14px -6px rgba(239,68,68,.35);

}

.card.today {
  border-left-color: #f59e0b;
  box-shadow: -2px 0 14px -6px rgba(245,158,11,.35);
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

.chevron {
  transition:.25s;
}


.chevron.rotated {
  transform:rotate(180deg);
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

/* ACTIONS */

.actions {
  display:flex;
  gap:6px;
}
</style>