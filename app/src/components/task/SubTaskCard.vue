<script setup lang="ts">
import type { Task } from '../../types/tasks.ts'
import TaskDate from './TaskDate.vue'
import TaskActions from './TaskActions.vue'
import TaskTitleRow from './TaskTitle.vue'

const props = defineProps<{
  subTask: Task
}>()

const emit = defineEmits<{
  (e: 'done', id: number): void
  (e: 'undone', id: number): void
  (e: 'edit', task: Task): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="subtask" :class="{ completed: subTask.done }">
    <div class="subtask-header">
      <TaskTitleRow :item="subTask" :is-task="false" @done="emit('done', $event)" @undone="emit('undone', $event)"/>

      <TaskActions
        :task-done="subTask.done"
        :show-add-sub="false"
        @edit="emit('edit', subTask)"
        @mark-done="emit('done', subTask.id)"
        @mark-undone="emit('undone', subTask.id)"
        @delete="emit('delete', subTask.id)"
      />
    </div>

    <p v-if="subTask.descricao" class="subtask-description">
      {{ subTask.descricao }}
    </p>

    <TaskDate v-if="subTask.dueDate || subTask.done" :task="subTask" />
  </div>
</template>

<style scoped>
.subtask {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(255,255,255,.03);
  border-radius: 10px;
  border-left: 2px solid rgba(255,255,255,.08);
}

.subtask.completed {
  border-left-color: #22c55e;
  opacity: .55;
}

.subtask.completed .subtask-description {
  text-decoration: line-through;
}

.subtask-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.subtask-description {
  margin: 0;
  font-size: .8rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
</style>