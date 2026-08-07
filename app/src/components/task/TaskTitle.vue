<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Task } from '../../types/tasks'

const props = defineProps<{
  item: Task
}>()

const emit = defineEmits<{
  (e: 'done', id: number): void
  (e: 'undone', id: number): void
}>()

const isTask = computed(() => props.item.parentId === undefined)

const showBadge = computed(() =>
  isTask ? (props.item.priority || props.item.done) : props.item.done
)

const label = computed(() =>
  props.item.done ? 'Completed' : `${props.item.priority} Priority`
)

const stateClass = computed(() => {
  if (props.item.done) return 'completed'
  if (!props.item.priority) return ''
  return `priority-${props.item.priority?.toLowerCase()}`
})

function toggle() {
    if(props.item.done) emit('undone', props.item.id)
    else emit('done', props.item.id)
}
</script>

<template>
  <div class="title-wrapper" :class="{ 'title-wrapper--subtask': !isTask }">
    <button class="check-button" :class="{ checked: item.done }" @click="toggle">
      <Check v-if="item.done" :size="14" :stroke-width="3" />
    </button>

    <component :is="isTask ? 'h3' : 'p'" class="title" :class=" { subtaskTitle: !isTask, completed: item.done }">
      {{ item.title }}
    </component>

    <span v-if="showBadge" class="status-badge" :class="stateClass">{{ label }}</span>
  </div>
</template>

<style scoped>
.title-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.title-wrapper--subtask {
  gap: 8px;
  flex-wrap: wrap;
}

.title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  overflow-wrap: break-word;
  word-break: break-word;
  transition: color .3s ease;
}

.title.subtaskTitle {
    font-size: 0.88rem;
}

.title.completed {
  color: var(--color-text-secondary);
  text-decoration: line-through;
}

.check-button {
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  background: transparent;
  color: white;

  cursor: pointer;
  transition: all 0.2s ease;
}

.check-button:hover {
  transform: scale(1.08);
  border-color: rgba(255, 255, 255, .45);
  background: rgba(255, 255, 255, .08);
}

.check-button.checked {
  background: #22c55e;
  border-color: #22c55e;
  color: #0a0a0a;
}

.check-button.checked:hover {
  background: #16a34a;
  border-color: #16a34a;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  flex-shrink: 0;
}

.status-badge.priority-high {
  color: var(--color-priority-high, #ef4444);
  background: color-mix(in srgb, var(--color-priority-high, #ef4444) 12%, transparent);
}

.status-badge.priority-medium {
  color: var(--color-priority-medium, #f59e0b);
  background: color-mix(in srgb, var(--color-priority-medium, #f59e0b) 12%, transparent);
}

.status-badge.priority-low {
  color: var(--color-priority-low, #3b82f6);
  background: color-mix(in srgb, var(--color-priority-low, #3b82f6) 12%, transparent);
}

.status-badge.completed {
  color: var(--color-priority-completed, #22c55e);
  background: color-mix(in srgb, var(--color-priority-completed, #22c55e) 12%, transparent);
}

@media (max-width: 640px) {
  .title-wrapper:not(.title-wrapper--subtask) {
    flex-wrap: wrap;
    row-gap: 6px;
    flex: 1 1 auto;
    min-width: 0;
  }
}

@media (max-width: 400px) {
  .title {
    font-size: 1.05rem;
  }
  .check-button {
    width: 26px;
    height: 26px;
  }
}
</style>