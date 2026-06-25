<script setup lang="ts">
import type { Task } from '../stores/tasks'
import { computed } from 'vue'
import { Check, Pencil, Trash2, Calendar, RotateCcw } from 'lucide-vue-next'
import SubTaskCard from './SubTaskCard.vue'

const props = defineProps<{
  task: Task
  subTasks: Task[]
}>()

defineEmits(['done', 'undone', 'delete', 'edit', 'addSubTask'])

const completedSubTasks = computed(() => {
  let count = 0
  for (const t of props.subTasks) {
    if (t.done) count++
  }
  return count
})

const totalSubTasks = computed(() => props.subTasks.length)

const progress = computed(() => {
  const total = totalSubTasks.value
  return total === 0 ? 0 : (completedSubTasks.value / total) * 100
})

const today = new Date().setHours(0, 0, 0, 0)

const dueDate = computed<number | null>(() => {
  const raw = props.task.dueDate
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

const actionsClass = computed(() =>
  props.subTasks.length > 0 ? 'actions' : 'actions-nonSubTasks'
)
</script>

<template>
  <div class="card" :class="{ completed: task.done }">

    <div class="card-top">
      <div class="content">

        <h3 class="title">{{ task.title }}</h3>

        <p class="description">{{ task.descricao }}</p>

        <!-- DATE -->
        <div class="date" :class="dueState">
          <Calendar :size="12" />

          <p>
            Due Date: {{ task.dueDate || 'No date' }}
          </p>

          <div v-if="timeSinceOverdue" class="warning">
            ⚠ {{ timeSinceOverdue }}
          </div>

          <div v-else-if="dueState === 'today'" class="warning today">
            ⚠ {{ 'Task due today' }}
          </div>
        </div>

        <!-- PROGRESS -->
        <div v-if="subTasks.length" class="progress-wrapper">
          <div class="progress-text">
            Subtasks: {{ completedSubTasks }} / {{ totalSubTasks }}
          </div>

          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progress + '%' }"
            />
          </div>
        </div>

        <!-- SUBTASKS -->
        <div v-if="subTasks.length" class="subtasks">
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

      <!-- ACTIONS -->
      <div :class="actionsClass">

        <button v-if="!task.done" class="icon-btn complete" @click="$emit('done', task.id)">
          <Check :size="17" />
        </button>

        <button v-if="!task.done" class="icon-btn edit" @click="$emit('edit', task)">
          <Pencil :size="17" />
        </button>

        <button v-if="!task.done" class="icon-btn add-subtask" @click="$emit('addSubTask', task.id)">
          +
        </button>

        <button v-else class="icon-btn edit" @click="$emit('undone', task.id)">
          <RotateCcw :size="17" />
        </button>


        <button class="icon-btn delete" @click="$emit('delete', task.id)">
          <Trash2 :size="17" />
        </button>

      </div>

    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 18px;
  margin-bottom: 12px;
  background: var(--color-primary-dark);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, .06);
}

.card.completed {
  opacity: .6;
}

/* LAYOUT */
.card-top {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
}

.content {
  flex: 1;
  min-width: 0;
}

/* TITLE */
.title {
  margin: 0 0 6px;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

/* DESCRIPTION */
.description {
  margin: 0 0 10px;
  color: var(--color-text-secondary);
  font-size: .88rem;
}

/* DATE */
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

/* PROGRESS */
.progress-wrapper {
  margin-bottom: 18px;
}

.progress-text {
  font-size: .75rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, .06);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
  transition: width .3s ease;
}

/* SUBTASKS */
.subtasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 14px;
  border-left: 2px solid rgba(255, 255, 255, .08);
}

/* ACTIONS */
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.actions-nonSubTasks{
  display: flex;
  flex-direction: row;
  gap: 6px;
  flex-shrink: 0;
}

/* BUTTONS */
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

.edit {
  background: rgba(100, 149, 255, .1);
  color: #6495ff;
}

.delete {
  background: rgba(255, 80, 80, .1);
  color: var(--color-warn);
}

.add-subtask {
  background: rgba(121, 111, 246, .1);
  color: var(--color-accent);
  font-size: 23px;
}
</style>