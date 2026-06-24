<script setup lang="ts">
import type { Task } from '../stores/tasks'
import { Check, Pencil, Trash2, Calendar, RotateCcw } from 'lucide-vue-next'

defineProps<{ task: Task }>()

defineEmits([
  'done',
  'undone',
  'delete',
  'edit'
])
</script>

<template>
  <div class="card" :class="{ completed: task.done }">

    <div class="content">

      <h3 class="title">
        {{ task.title }}
      </h3>

      <p class="description">
        {{ task.descricao }}
      </p>

      <div class="meta">
        <span class="tag">
          <Calendar :size="14"/>
          {{ task.dueDate || 'No date' }}
        </span>
      </div>

    </div>

    <div class="actions">

      <button v-if="!task.done" class="icon-btn complete" @click="$emit('done', task.id)">
        <Check :size="18"/>
      </button>

      <button v-if="!task.done" class="icon-btn edit" @click="$emit('edit', task)">
        <Pencil :size="18"/>
      </button>

      <button v-else class="icon-btn edit" @click="$emit('undone', task.id)">
        <RotateCcw :size="18"/>
      </button>

      <button class="icon-btn delete" @click="$emit('delete', task.id)">
        <Trash2 :size="18"/>
      </button>

    </div>

  </div>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: 18px;

  margin-bottom: 12px;

  background: var(--color-primary-dark);

  border-radius: 14px;

  border: 1px solid rgba(255,255,255,.06);

  transition: .2s;
}

.card:hover {
  transform: translateY(-2px);

  border-color:
  rgba(121,111,246,.3);
}

.content {
  flex: 1;
}

.title {
  margin: 0;

  font-size: 1rem;
  font-weight: 600;

  color: white;
}

.description {
  margin-top: 6px;
  margin-bottom: 10px;

  color: var(--color-text-secondary);

  font-size: .9rem;

  line-height: 1.5;
}

.meta {
  display: flex;
  gap: 10px;
}

.tag {
  display: flex;
  align-items: center;

  gap: 5px;

  padding: 4px 10px;

  border-radius: 999px;

  background:
  rgba(255,255,255,.06);

  font-size: .8rem;

  color:
  var(--color-text-secondary);
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 36px;
  height: 36px;

  border: none;
  border-radius: 10px;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: .2s;
}

.complete {
  background: rgba(0,255,150,.12);
  color: var(--color-success);
}

.edit {
  background: rgba(100,149,255,.12);
  color: #6495ff;
}

.delete {
  background: rgba(255,80,80,.12);
  color: var(--color-warn);
}

.icon-btn:hover {
  transform: translateY(-2px);
}

.completed {
  opacity: .6;
}

.completed .title,
.completed .description {
  text-decoration: line-through;
}
</style>