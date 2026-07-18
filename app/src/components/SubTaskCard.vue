<script setup lang="ts">
import type { Task } from '../types/tasks.ts'
import {Calendar, EllipsisVertical} from 'lucide-vue-next'
import { ref } from 'vue'
import { useTaskState } from '../composables/useTaskState.ts'
import '../styles/task-ui.css'
import TaskOptionsMenu from './TaskOptionsMenu.vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  subTask: Task
}>()

const emit = defineEmits([
  'done',
  'undone',
  'edit',
  'delete'
])

const { dueState, timeSinceOverdue } = useTaskState(props.subTask)


const showOptions = ref(false)

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function editTask() {
  showOptions.value = false
  emit('edit', props.subTask)
}

function deleteTask() {
  showOptions.value = false
  emit('delete', props.subTask.id)
}

function markAsDone() {
  showOptions.value = false
  emit('done', props.subTask.id)
}

function markAsUndone() {
  showOptions.value = false
  emit('undone', props.subTask.id)
}

const button = ref()
const menu = ref()

onClickOutside(menu, () => {
  showOptions.value = false
}, {
  ignore: [button]
})
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

    <div class="task-actions" :class="{ 'completed': subTask.done }">
      <button ref="button" class="icon-btn" @click="toggleOptions">
        <EllipsisVertical />
      </button>
      <TaskOptionsMenu
        ref="menu"
        :show="showOptions"
        :add-sub-task="false"
        :task-done="subTask.done"
        @edit="editTask"
        @delete="deleteTask"
        @markDone="markAsDone"
        @markUndone="markAsUndone"
      />
    </div>

  </div>

  <p v-if="subTask.descricao" class="subtask-description">
    {{ subTask.descricao }}
  </p>

    <div class="date" :class="dueState">
    <div class="date-content">
      <Calendar :size="12" />

      <p v-if="dueState !== 'done'">
        <strong>Due Date:</strong>
        {{ subTask.dueDate || 'No date' }}
      </p>

      <p v-else>
        <strong>Completed on:</strong>
        {{ subTask.doneDate }}
      </p>
    </div>

    <p v-if="timeSinceOverdue" class="warning overdue-warning">
      ⚠ {{ timeSinceOverdue }}
    </p>

    <p v-else-if="dueState === 'today'" class="warning today-warning">
      ⚠ Due today
    </p>
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

/* PRIORITY */

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