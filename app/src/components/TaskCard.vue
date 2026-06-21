<script setup lang="ts">
import type { Task } from '../stores/tasks'

defineProps<{ task: Task }>()
defineEmits(['done', 'delete'])
</script>

<template>
  <div class="card" :class="{ completed: task.done }">
    <p class="text">{{ task.descricao }}</p>

    <div class="actions">

      <button v-if="!task.done" class="btn btn-success" @click="$emit('done', task.id)">
        Done
      </button>

      <button class="btn btn-danger" @click="$emit('delete', task.id)">
        Delete
      </button>

    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 16px;
  margin-bottom: 10px;

  background: var(--color-primary-dark);
  border-radius: 14px;
}

.text {
  flex: 1;
  margin: 0;
  color: var(--color-light);
}

.completed .text {
  text-decoration: line-through;
  opacity: .5;
}

.actions {
  display: flex;
  gap: 10px;
}


.btn-success {
  background: var(--color-success);
  border-color: var(--color-success);
}

.btn-danger {
  background: var(--color-warn);
  border-color: var(--color-warn);
}


.btn-success:hover {
  color: var(--color-success);
}

.btn-danger:hover {
  color: var(--color-warn);
}
</style>