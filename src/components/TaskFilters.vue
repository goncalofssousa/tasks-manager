<template>
    <div class="filters segmented">

    <div class="slider" :class="filter"></div>

    <button v-for="f in filters" :key="f.value" class="seg-btn" @click="$emit('updateFilter', f.value)" :class="{ active: filter === f.value }">
      {{ f.label }}
    </button>

  </div>
</template>

<script setup lang="ts">
defineProps<{ filter: 'all' | 'active' | 'done' }>()
const emit = defineEmits(['updateFilter'])

const filters: { label: string; value: 'all' | 'active' | 'done' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Done', value: 'done' }
]
</script>

<style scoped>
.filters.segmented {
  display: flex;
  width: 100%;

  margin: 15px 0;
  padding: 6px;

  background: var(--color-primary-dark);
  border-radius: 14px;

  gap: 6px;

  position: relative;
  overflow: hidden;
}

.filters.segmented button {
  flex: 1;
  height: 48px;

  border: none;
  border-radius: 10px;

  background: transparent;

  font-size: 0.95rem;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  color: var(--color-text-secondary);
  z-index: 1;
  font-family: Poppins, sans-serif;
}

.filters.segmented .seg-btn.active {
  color: #ffffff !important;
  font-weight: 700;
}

.filters.segmented button:hover {
  color: white;
  transform: translateY(-1px);
}

.slider {
  position: absolute;
  top: 6px;
  bottom: 6px;

  width: calc(33.333% - 6px);

  border-radius: 10px;

  background: var(--color-accent);

  transition: transform 0.3s ease, filter 0.2s ease;

  box-shadow: 0 6px 16px rgba(121, 111, 246, 0.25);
}

.filters.segmented:hover .slider {
  filter: brightness(1.08);
}

.slider.all {
  transform: translateX(0%);
}

.slider.active {
  transform: translateX(100%);
}

.slider.done {
  transform: translateX(200%);
}
</style>