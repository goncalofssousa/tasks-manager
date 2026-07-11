<script setup lang="ts">
import type { Task } from '../types/tasks.ts'
import {Check,Pencil,Trash2,Calendar,RotateCcw} from 'lucide-vue-next'
import { computed } from 'vue'
import { useTaskState } from '../composables/useTaskState.ts'
import '../styles/task-ui.css'

const props = defineProps<{
  subTask: Task
}>()

defineEmits([
  'done',
  'undone',
  'edit',
  'delete'
])

const { dueState, timeSinceOverdue } = useTaskState(props.subTask)

const priorityClass = computed(() => {
  if (!props.subTask.priority)
    return ''

  return `priority-${props.subTask.priority.toLowerCase()}`
})

const stateClass = computed(() => {
  if (props.subTask.done)
    return 'completed'

  if (dueState.value === 'overdue')
    return 'overdue'

  if (dueState.value === 'today')
    return 'today'

  return ''
})
</script>

<template>

<div class="subtask":class="stateClass">

  <div class="subtask-header">
    <div class="subtask-title-wrapper">
      <p class="subtask-title">
        {{ subTask.title }}
      </p>

      <span v-if="subTask.priority" class="priority-badge" :class="priorityClass">
        {{ subTask.priority }} Priority
      </span>
    </div>

    <div class="subtask-actions">
      <button v-if="!subTask.done" class="icon-btn complete small" @click="$emit('done', subTask.id)" >
        <Check :size="13"/>
      </button>

      <button v-if="!subTask.done" class="icon-btn edit small" @click="$emit('edit', subTask)">
        <Pencil :size="13"/>
      </button>

      <button v-else class="icon-btn edit small" @click="$emit('undone', subTask.id)">
        <RotateCcw :size="13"/>
      </button>

      <button class="icon-btn delete small" @click="$emit('delete', subTask.id)">
        <Trash2 :size="13"/>
      </button>
    </div>

  </div>

  <p v-if="subTask.descricao" class="subtask-description">
    {{ subTask.descricao }}
  </p>

  <div class="date" :class="dueState">
    <Calendar :size="12"/>

    <p v-if="dueState !== 'done'">
      Due Date:
      {{ subTask.dueDate || 'No date' }}
    </p>

    <p v-else>
      Task Completed:
      {{ subTask.doneDate }}
    </p>

    <div v-if="timeSinceOverdue" class="warning overdue-warning">
      ⚠ {{ timeSinceOverdue }}
    </div>

    <div v-else-if="dueState === 'today'" class="warning today-warning">
      ⚠ Task due today
    </div>
  </div>

</div>

</template>



<style scoped>

.subtask {
  display:flex;
  flex-direction:column;
  gap:8px;
  padding:10px 12px;
  background:rgba(255,255,255,.03);
  border-radius:10px;
  border-left:2px solid rgba(255,255,255,.08);
}

/* STATES */


.subtask.completed {
  opacity:.55;
  border-left-color:#22c55e;
  text-decoration:line-through;
}

.subtask.overdue {
  border-left-color:#ef4444;
}


.subtask.today {
  border-left-color:#f59e0b;
}

.subtask-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:100%;
}

.subtask-title-wrapper {
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}

.subtask-title {
  margin:0;
  color:white;
  font-size:.88rem;
  font-weight:500;
}

.subtask-description {
  margin:0;
  font-size:.8rem;
  color:var(--color-text-secondary);
  line-height:1.4;
}

.subtask-actions {
  display:flex;
  gap:5px;
}

/* PRIORITY */

.priority-badge {
  padding:2px 8px;
  border-radius:999px;
  font-size:.6rem;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.06em;
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
</style>