<script setup lang="ts">
import { computed } from 'vue'
import { X, RotateCcw } from 'lucide-vue-next'
import Filters from './Filters.vue'
import type { Filter } from '../types/filter'

const props = defineProps<{
  show: boolean

  statusFilters: Filter[]
  priorityFilters: Filter[]

  statusValue: string[]
  priorityValue: string[]
}>()

const emit = defineEmits<{
  close: []
  statusChange: [value: string]
  priorityChange: [value: string]
  reset: []
}>()

const hasActiveFilters = computed(() => {
  return !props.statusValue.includes('all') || !props.priorityValue.includes('all')
})
</script>

<template>
  <Transition name="panel">
    <div v-if="show" class="filter-panel">

      <div class="filter-header">
        <h3>Filters</h3>

        <div class="header-actions">
          <button
            v-if="hasActiveFilters"
            class="reset-btn"
            @click="$emit('reset')"
          >
            <RotateCcw :size="13" />
            Clear
          </button>

          <button class="close-btn" @click="$emit('close')">
            <X :size="16" />
          </button>
        </div>
      </div>

      <div class="filter-body">
        <div class="filter-section">
          <span>Status</span>
          <Filters
            :all-filters="statusFilters"
            :current-filter-values="statusValue"
            @clicked-filter="$emit('statusChange', $event)"
          />
        </div>

        <div class="divider" />

        <div class="filter-section">
          <span>Priority</span>
          <Filters
            :all-filters="priorityFilters"
            :current-filter-values="priorityValue"
            @clicked-filter="$emit('priorityChange', $event)"
          />
        </div>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.filter-panel {
  margin: 12px 0 20px;
  padding: 18px 20px;

  background: var(--color-primary-dark);

  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);

  box-shadow: 0 4px 16px rgba(0,0,0,.18);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 16px;
}

.filter-header h3 {
  font-size: .95rem;
  font-weight: 600;
  color: var(--color-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 5px;

  padding: 5px 10px;

  border: none;
  border-radius: 8px;
  background: transparent;

  color: var(--color-text-secondary);
  font-family: Poppins, sans-serif;
  font-size: .78rem;
  font-weight: 600;

  cursor: pointer;
  transition: all .2s ease;
}

.reset-btn:hover {
  color: var(--color-accent);
  background: rgba(121,111,246,.1);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;

  border: none;
  border-radius: 8px;
  background: transparent;

  color: var(--color-text-secondary);

  cursor: pointer;
  transition: all .2s ease;
}

.close-btn:hover {
  color: var(--color-light);
  background: rgba(255,255,255,.08);
}

.filter-body {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.filter-section {
  flex: 1;
}

.filter-section span {
  display: block;

  margin-bottom: 10px;

  font-size: .72rem;
  font-weight: 700;

  color: var(--color-text-secondary);

  text-transform: uppercase;
  letter-spacing: .05em;
}

.divider {
  width: 1px;
  align-self: stretch;

  background: rgba(255,255,255,.08);
}

/* transition */
.panel-enter-active,
.panel-leave-active {
  transition: all .2s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 480px) {
  .filter-body {
    flex-direction: column;
    gap: 18px;
  }

  .divider {
    display: none;
  }
}
</style>