<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../stores/tasks'
import {
  Check,
  Pencil,
  Trash2,
  Calendar,
  RotateCcw
} from 'lucide-vue-next'

const props = defineProps<{
  subTask: Task
}>()

defineEmits([
  'done',
  'undone',
  'edit',
  'delete'
])

const today = new Date().setHours(0, 0, 0, 0)

const dueDate = computed<number | null>(() => {
  const raw = props.subTask.dueDate
  if (!raw) return null

  const date = new Date(raw)
  if (isNaN(date.getTime())) return null

  date.setHours(0, 0, 0, 0)
  return date.getTime()
})

type DueState = 'overdue' | 'today' | 'future'

const dueState = computed<DueState>(() => {
  if (!dueDate.value) return 'future'

  if (dueDate.value < today) return 'overdue'
  if (dueDate.value === today) return 'today'
  return 'future'
})


const timeSinceOverdue = computed(() => {
  if (dueState.value !== 'overdue' || !dueDate.value) return ''

  const diffMs = Date.now() - dueDate.value
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays >= 30) {
    return `${Math.floor(diffDays / 30)} months overdue`
  }

  if (diffDays >= 7) {
    return `${Math.floor(diffDays / 7)} weeks overdue`
  }

  if (diffDays < 1) return 'Overdue today'
  if (diffDays === 1) return '1 day overdue'

  return `${diffDays} days overdue`
})
</script>

<template>
  <div class="subtask" :class="{ completed: subTask.done }">

    <div class="subtask-left">

      <p class="subtask-title">
          {{ subTask.title }}
      </p>

      <p class="subtask-description">
        {{ subTask.descricao }}
      </p>

       <div class="date" :class="dueState">
          <Calendar :size="12" />

          <p>
            Due Date: {{ subTask.dueDate || 'No date' }}
          </p>

          <div v-if="timeSinceOverdue" class="warning">
            ⚠ {{ timeSinceOverdue }}
          </div>

          <div v-else-if="dueState === 'today'" class="warning today">
            ⚠ {{ 'Task due today' }}
          </div>
        </div>
    </div>

    <div class="subtask-actions">
      <button v-if="!subTask.done" class="icon-btn complete" @click="$emit('done', subTask.id)">
        <Check :size="13" />
      </button>

      <button v-if="!subTask.done" class="icon-btn edit" @click="$emit('edit', subTask)">
        <Pencil :size="13" />
      </button>

      <button v-else class="icon-btn edit" @click="$emit('undone', subTask.id)">
        <RotateCcw :size="13" />
      </button>

      <button class="icon-btn delete" @click="$emit('delete', subTask.id)">
        <Trash2 :size="13" />
      </button>
    </div>

  </div>
</template>

<style scoped>
.subtask {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,.03);
}

.subtask.completed {
  opacity: .55;
}

.subtask-left {
  flex: 1;
  min-width: 0;
}

.subtask-title {
  margin: 0 0 6px;
  color: white;
  font-size: .88rem;
  font-weight: 500;
  word-break: break-word;
}

.subtask.completed .subtask-title {
  text-decoration: line-through;
}

.subtask-description {
  margin: 0 0 8px;
  font-size: .8rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
  word-break: break-word;
}

.subtask-actions {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
}


.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s, opacity .15s;
}

.icon-btn:hover {
  transform: translateY(-1px);
  opacity: .85;
}

.complete { 
  background: rgba(0, 255, 150, .1);   
  color: var(--color-success);
}
.edit     { 
  background: rgba(100, 149, 255, .1); 
  color: #6495ff; 
}
.delete   { 
  background: rgba(255, 80, 80, .1);   
  color: var(--color-warn); 
}
.add-subtask  { 
  background: rgba(121, 111, 246, .1); 
  color: var(--color-accent); 
  font-size: 23px;
}

.date {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: .72rem;
  padding: 3px 8px;
  border-radius: 6px;
  margin: 0 0 14px;
  flex-wrap: wrap;
}

.overdue {
  background: rgba(255, 80, 80, .10);
  color: var(--color-warn);
  border: 1px solid rgba(255, 80, 80, .25);
}

.today {
  background: rgba(255, 200, 0, .10);
  color: #f5c542;
  border: 1px solid rgba(255, 200, 0, .25);
}

.future {
  background: rgba(121, 111, 246, .10);
  color: var(--color-accent);
  border: 1px solid rgba(121, 111, 246, .25);
}

/* OVERDUE BADGE */
.warning {
  padding: 4px 8px;
  font-size: .7rem;
  font-weight: 600;
  border-radius: 6px;

  display: inline-flex;
  align-items: center;
  gap: 4px;

  background: rgba(255, 80, 80, .15);
  color: var(--color-warn);
  border: 1px solid rgba(255, 80, 80, .35);

  animation: pulseWarning 1.8s infinite;
}

.warning.today {
  background: rgba(255, 200, 0, .15);
  color: #f5c542;
  border: 1px solid rgba(255, 200, 0, .35);
}

@keyframes pulseWarning {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 80, 80, .35);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 80, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 80, 80, 0);
  }
}
</style>