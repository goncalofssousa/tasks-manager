<template>
  <form class="form" @submit.prevent="submit">
    <input v-model="text" placeholder="Add task..." />
    <button :disabled="!text.trim()">Add</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTasksStore } from '../stores/tasks'

const store = useTasksStore()
const text = ref('')

function submit() {
  if (!text.value.trim()) return
  store.addTask(text.value)
  text.value = ''
}
</script>

<style scoped>
button {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: var(--color-accent);
  color: white;
}
</style>