<script setup lang="ts">
import type { Task } from '../stores/tasks'
import { computed } from 'vue'
import { Check, Pencil, Trash2, Calendar, RotateCcw } from 'lucide-vue-next'
import SubTaskCard from './SubTaskCard.vue'
import { useTaskDate } from '../composables/useTaskDate'

const props = defineProps<{
  task: Task
  subTasks: Task[]
}>()

defineEmits(['done', 'undone', 'delete', 'edit', 'addSubTask'])

const { dueState, timeSinceOverdue } = useTaskDate(props.task)

const completedSubTasks = computed(() =>
  props.subTasks.filter(t => t.done).length
)

const progress = computed(() =>
  props.subTasks.length === 0
    ? 0
    : (completedSubTasks.value / props.subTasks.length) * 100
)

const actionsClass = computed(() =>
  props.subTasks.length ? 'actions' : 'actions-nonSubTasks'
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

        <!-- PROGRESS -->
        <div v-if="subTasks.length" class="progress-wrapper">
          <div class="progress-text">
            Subtasks: {{ completedSubTasks }} / {{ subTasks.length }}
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

.title {
  margin: 0 0 6px;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.card.completed .title {
  text-decoration: line-through;
}

.description {
  margin: 0 0 10px;
  color: var(--color-text-secondary);
  font-size: .88rem;
}

.progress-wrapper {
  margin-top: 14px;
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

.add-subtask {
  background: rgba(121, 111, 246, .1);
  color: var(--color-accent);
  font-size: 23px;
}
</style>