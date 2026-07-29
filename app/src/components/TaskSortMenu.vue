<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import type { TaskComparator } from '../types/tasks';

const props = defineProps<{
  show: boolean
  sortOptions: Record<string, TaskComparator>
  modelValue: string
}>()

const emit = defineEmits<{
  close: []
  toggleSort: [key: string]
}>()


function isActive(key: string) {
  return props.modelValue === key
}

function handleSortClick(key: string) {
  emit('toggleSort', key)
}
</script>

<template>
  <Transition name="panel">
    <div v-if="show" class="sort-panel">

      <div class="sort-header">
        <h3>Sort Options</h3>

        <div class="header-actions">
          <button class="close-btn" @click="$emit('close')">
            <X :size="16" />
          </button>
        </div>
      </div>

      <div class="sort-body">
        <div class="sort-list">
            <label v-for="(comparator, key) in sortOptions" :key="key" class="sort-option" @click="handleSortClick(key)">
                <span class="checkbox" :class="{ checked: isActive(key) }">
                <Check v-if="isActive(key)" :size="12" />
                </span>
                <span class="sort-label">{{ comparator.label }}</span>
            </label>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sort-panel {
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

.sort-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 14px;
}

.sort-header h3 {
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

.sort-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sort-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sort-title {
  font-size: .7rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: .05em;
}

.sort-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sort-option {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 5px 6px;
  border-radius: 8px;

  cursor: pointer;
  transition: background .15s ease;
}

.sort-option:hover {
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

.sort-label {
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
  .sort-panel {
    left: 0;
    right: 0;
    width: auto;
  }
}
</style>