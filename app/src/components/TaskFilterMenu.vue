<script setup lang="ts">
import { computed } from 'vue'
import { X, RotateCcw, Check } from 'lucide-vue-next'
import type { Filter } from '../types/filter';

const props = defineProps<{
  show: boolean
  filters: Record<string, Filter[]>
  modelValue: string[]
}>()

const emit = defineEmits<{
  close: []
  toggleFilter: [value: string, title?: string]
  reset: []
}>()

const hasActiveFilters = computed(() => props.modelValue.length > 0)


function isActive(value: string) {
  return props.modelValue.includes(value)
}

function handleFilterClick(value: string, title?: string) {
  emit('toggleFilter', value, title)
}
</script>

<template>
  <Transition name="panel">
    <div v-if="show" class="filter-panel">

      <div class="filter-header">
        <h3>Filters</h3>

        <div class="header-actions">
          <button v-if="hasActiveFilters" class="reset-btn" @click="$emit('reset')">
            <RotateCcw :size="13" />
            Clear
          </button>

          <button class="close-btn" @click="$emit('close')">
            <X :size="16" />
          </button>
        </div>
      </div>

      <div class="filter-body">
        <div v-for="(filterList, groupName) in filters" :key="groupName" class="filter-group">
          <span class="filter-title">{{ groupName }}</span>

          <div class="filter-list">
            <label
              v-for="filter in filterList"
              :key="filter.value"
              class="filter-option"
              @click.prevent="handleFilterClick(filter.value, groupName)"
            >
              <span class="checkbox" :class="{ checked: isActive(filter.value) }">
                <Check v-if="isActive(filter.value)" :size="12" />
              </span>
              <span class="filter-label">{{ filter.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.filter-panel {
  position: absolute;
  top: calc(100%);
  right: 0;
  z-index: 50;

  width: 100%;
  min-width: 260px;
  max-height: 70vh;
  overflow-y: auto;

  margin: 0;
  padding: 16px 18px;

  background: var(--color-primary-dark);

  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.08);

  box-shadow: 0 12px 32px rgba(0,0,0,.35);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 14px;
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
  flex-direction: column;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-title {
  font-size: .7rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: .05em;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 5px 6px;
  border-radius: 8px;

  cursor: pointer;
  transition: background .15s ease;
}

.filter-option:hover {
  background: rgba(255,255,255,.06);
}

.checkbox {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;

  border-radius: 5px;
  border: 1.5px solid rgba(255,255,255,.2);

  color: white;

  transition: all .15s ease;
}

.checkbox.checked {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.filter-label {
  font-size: .85rem;
  font-weight: 500;
  color: var(--color-light);
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
  .filter-panel {
    left: 0;
    right: 0;
    width: auto;
  }
}
</style>