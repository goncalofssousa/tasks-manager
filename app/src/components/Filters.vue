<script setup lang="ts">
import type { Filter } from '../types/filter'

const props = defineProps<{
  allFilters: Filter[]
  currentFilterValues: string[]
  title?: string
}>()

const emit = defineEmits<{
  clickedFilter: [value: string, title?: string]
}>()

</script>

<template>
  <span v-if="title" class="filter-title">{{ title }}</span>
  <div class="filters">
    <button 
      v-for="f in allFilters" 
      :key="f.value" 
      class="pill"
      :class="{ active: currentFilterValues.includes(f.value) }" 
      @click="title ? $emit('clickedFilter', f.value, title) : $emit('clickedFilter', f.value)"
    >
      {{ f.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-title {
  font-family: Poppins, sans-serif;
  font-size: .9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  display: block;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 8px 14px;

  border: 1px solid rgba(255, 255, 255, .08);
  border-radius: 999px;

  background: var(--color-primary-dark);
  color: var(--color-text-secondary);

  font-family: Poppins, sans-serif;
  font-size: .82rem;
  font-weight: 500;

  cursor: pointer;
  transition: all .15s ease;
  white-space: nowrap;
}

.pill:hover {
  border-color: rgba(255, 255, 255, .18);
  color: white;
}

.pill.active {
  background: rgba(121, 111, 246, .15);
  border-color: rgba(121, 111, 246, .5);
  color: var(--color-accent);
}

.pill:active {
  transform: scale(0.96);
}

@media (max-width: 480px) {
  .filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
  }

  .pill {
    flex-shrink: 0;
  }
}
</style>