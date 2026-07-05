<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,0.6);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 420px;

  background: var(--color-primary-dark);
  border-radius: 14px;

  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 600px) {
  .modal {
    max-width: 320px;
  }
}
</style>