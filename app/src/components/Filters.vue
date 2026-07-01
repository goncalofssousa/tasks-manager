<script setup lang="ts">
import { computed } from 'vue'
import type { Filter } from '../types/filter';

const props = defineProps<{ 
  allFilters: Filter[]
  currentFilterValue: string 
}>()

const emit = defineEmits(['updateFilter'])

const sliderStyle = computed(() => {
  const index = props.allFilters.findIndex(
    f => f.value === props.currentFilterValue
  )

  const width = 100 / props.allFilters.length

  return {
    width: `calc(${width}%)`,
    transform: `translateX(${index * 100}%)`
  }
})
</script>

<template>
  <div class="filters">
    
    <div class="slider" :style="sliderStyle"></div>

    <button v-for="f in props.allFilters" :key="f.value" class="seg-btn" @click="emit('updateFilter', f.value)" :class="{ active: currentFilterValue === f.value }">
      {{ f.label }}
    </button>

  </div>
</template>

<style scoped>
.filters {
  display: flex;
  width: 100%;

  background: var(--color-primary-dark);
  border-radius: 14px;

  gap: 6px; 

  position: relative;
  overflow: hidden;
}

.filters button {
  flex: 1;
  height: 60px;

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

.filters .seg-btn.active {
  color: #ffffff !important;
  font-weight: 700;
}

.filters button:hover {
  color: white;
  transform: translateY(-1px);
}

.slider {
  position: absolute;
  top: 0px;
  bottom: 0px;

  border-radius: 14px;
  background: var(--color-accent);

  transition: transform 0.3s ease, width 0.3s ease;

  box-shadow: 0 6px 16px rgba(121, 111, 246, 0.25);
  overflow: hidden;
}

.filters:hover .slider {
  filter: brightness(1.08);
}

@media (max-width: 600px) {
  .filters button {
    font-size: 0.68rem;
    padding: 0 2px;
    height: 40px;
    letter-spacing: -0.01em;
  }
}

@media (max-width: 400px) {
  .filters button {
    font-size: 0.6rem;
  }
} 
</style>