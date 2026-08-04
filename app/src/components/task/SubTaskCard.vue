<script setup lang="ts">
import type { Task } from '../../types/tasks.ts'
import TaskDate from './TaskDate.vue'
import TaskActions from './TaskActions.vue'

const props = defineProps<{
  subTask: Task
}>()

const emit = defineEmits([
  'done',
  'undone',
  'edit',
  'delete'
])
</script>

<template>

<div class="subtask":class="{'completed': subTask.done}">
  <div class="subtask-header">
    <div class="subtask-title-wrapper">
      <p class="subtask-title">
        {{ subTask.title }}
      </p>

      <span v-if="subTask.done" class="badge completed">
        Completed
      </span>
    </div>

    
      <TaskActions 
        :task-done="subTask.done" 
        :add-sub-task="true" 
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
  display:flex;
  flex-direction:column;
  gap:8px;
  padding:10px 12px;
  background:rgba(255,255,255,.03);
  border-radius:10px;
  border-left:2px solid rgba(255,255,255,.08);
}


.subtask.subtask.completed{
  border-left-color:#22c55e;
  opacity: .55;
}

.subtask.completed .subtask-title,
.subtask.completed .subtask-description {
  text-decoration: line-through;
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

.badge {
  padding:2px 8px;
  border-radius:999px;
  font-size:.6rem;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.06em;
}

.badge.completed {
  color:#22c55e;
  background:rgba(34,197,94,.12);
}
</style>