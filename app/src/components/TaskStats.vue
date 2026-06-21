<script setup lang="ts">
defineProps<{ active: number, done: number }>()
</script>

<template>
  <p class="stats">
    Active: {{ active }} | Done: {{ done }}
  </p>
</template>

<style scoped>
.stats {
  color: var(--color-text-secondary);
}
</style>