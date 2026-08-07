<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  done: boolean
  priority?: string
}>()

const label = computed(() =>
  props.done ? 'Completed' : `${props.priority} Priority`
)

const stateClass = computed(() => {
  if (props.done) return 'completed'
  if (!props.priority) return ''
  return `priority-${props.priority.toLowerCase()}`
})
</script>

<template>
  <span class="status-badge" :class="stateClass">{{ label }}</span>
</template>

<style scoped>
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
</style>