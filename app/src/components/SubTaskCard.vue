<script setup lang="ts">
import type { Task } from '../types/tasks.ts'
import { Check, Pencil, Trash2, Calendar, RotateCcw } from 'lucide-vue-next'
import { useTaskState } from '../composables/useTaskState.ts'
import '../styles/task-ui.css'

const props = defineProps<{
  subTask: Task
}>()

defineEmits(['done', 'undone', 'edit', 'delete'])

const { dueState, timeSinceOverdue } = useTaskState(props.subTask)
</script>

<template>
  <div class="subtask" :class="{ completed: subTask.done }">

    <div class="subtask-header">

      <p class="subtask-title">
        {{ subTask.title }}
      </p>

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

    <p v-if="subTask.descricao" class="subtask-description">
      {{ subTask.descricao }}
    </p>

    <div class="date" :class="dueState">
      <Calendar :size="12" />

      <p v-if="dueState !== 'done'">
        Due Date: {{ subTask.dueDate || 'No date' }}
      </p>

      <p v-else>
        Task Completed: {{ subTask.doneDate }}
      </p>

      <div v-if="timeSinceOverdue" class="warning overdue">
        ⚠ {{ timeSinceOverdue }}
      </div>

      <div v-else-if="dueState === 'today'" class="warning today">
        ⚠ Task due today
      </div>
    </div>

  </div>
</template>


<style scoped>
.subtask {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 5px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,.03);
}

.subtask.completed {
  opacity: .55;
}

.subtask-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.subtask-title {
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
</style>