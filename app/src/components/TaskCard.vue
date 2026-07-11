<script setup lang="ts">
import type { Task } from '../types/tasks'
import { computed, ref } from 'vue'
import { Check, Pencil, Trash2, Calendar, RotateCcw, ChevronDown } from 'lucide-vue-next'
import SubTaskCard from './SubTaskCard.vue'
import { useTaskState } from '../composables/useTaskState.ts'
import '../styles/task-ui.css'

const props = defineProps<{
  task: Task
  subTasks: Task[]
}>()

defineEmits(['done', 'undone', 'delete', 'edit', 'addSubTask'])

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
  if(props.task.done) return 'completed'
  if(props.task.priority) return`priority-${props.task.priority.toLowerCase()}` 
  return ''

}
)

function toggleSubTasks(){
  showSubTasks.value = !showSubTasks.value
}
</script>

<template>
  <div class="card" :class="[{ completed: task.done }, priorityClass]">
    <div class="header">
      <h3 class="title">{{ task.title }}</h3>

      <div class="actions">
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

    <p v-if="task.descricao" class="description">{{ task.descricao }}</p>

    <div class="date" :class="dueState">
      <Calendar :size="12" />

      <p v-if="dueState !== 'done'">
        Due Date: {{ task.dueDate || 'No date' }}
      </p>

      <p v-else>
        Task Completed: {{ task.doneDate }}
      </p>

      <div v-if="timeSinceOverdue" class="warning overdue">
        ⚠ {{ timeSinceOverdue }}
      </div>

      <div v-else-if="dueState === 'today'" class="warning today">
        ⚠ Task due today
      </div>
    </div>

    <span v-if="task.priority" class="priority-badge" :class="priorityClass">
      {{ task.priority }}
    </span>

    <div v-if="subTasks.length" class="progress-wrapper">
      <div class="progress-header">
        <div class="progress-text">
          Subtasks: {{ completedSubTasks }} / {{ subTasks.length }}
        </div>

        <button class="toggle-btn" @click="toggleSubTasks">
          <ChevronDown :size="16" class="chevron" :class="{ rotated: showSubTasks }"/>
          <span class="toggle-text">{{ showSubTasks ? 'Hide' : 'See' }}</span>
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
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 18px;
  margin-top: 10px;
  margin-bottom: 12px;
  background: var(--color-primary-dark);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, .06);
  box-sizing: border-box;
}

.card.completed {
  opacity: .6;
  border-left: 3px solid #34d399;
  box-shadow: -2px 0 14px -6px rgba(52, 211, 153, .35);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  line-height: 1.4;
}

.card.completed .title {
  text-decoration: line-through;
}

.description {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: .88rem;
  line-height: 1.5;
}

.card.completed .description {
  text-decoration: line-through;
}


/* PROGRESS */
.progress-wrapper {
  margin-top: 6px;
  width: 100%;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-text {
  font-size: .75rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
  transition: color .2s;
}

.toggle-btn:hover {
  color: white;
}

.toggle-text {
  font-size: .75rem;
  font-weight: 500;
}

.chevron {
  transition: transform .25s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.progress-bar {
  width: 100%;
  height: 6px;
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
  width: 100%;
  gap: 8px;
  padding-left: 14px;
  margin-top: 4px;
  border-left: 2px solid rgba(255, 255, 255, .08);
  box-sizing: border-box;
}

/* ACTIONS & BUTTONS */
.actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

/* PRIORITY */
.card.priority-high {
  border-left: 3px solid #f87171;
  box-shadow: -2px 0 14px -6px rgba(248, 113, 113, .35);
}

.card.priority-medium {
  border-left: 3px solid #fbbf24;
  box-shadow: -2px 0 14px -6px rgba(251, 191, 36, .35);
}

.card.priority-low {
  border-left: 3px solid #60a5fa;
  box-shadow: -2px 0 14px -6px rgba(96, 165, 250, .35);
}

.priority-badge {
  font-size: .68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  padding: 2px 9px;
  border-radius: 999px;
  width: fit-content;
}

.priority-badge.priority-high {
  color: #f87171;
  background: rgba(248, 113, 113, .12);
}

.priority-badge.priority-medium {
  color: #fbbf24;
  background: rgba(251, 191, 36, .12);
}

.priority-badge.priority-low {
  color: #60a5fa;
  background: rgba(96, 165, 250, .12);
}

.priority-badge.completed {
  color: #34d399;
  background: rgba(52, 211, 153, .12);
}
</style>