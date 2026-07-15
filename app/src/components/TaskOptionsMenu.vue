<script setup lang="ts">
import '../styles/task-ui.css'
import { Check, RotateCcw, Pencil, Trash2, Plus } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  taskDone: boolean
  addSubTask: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'addSubTask'): void
  (e: 'markDone'): void
  (e: 'markUndone'): void
  (e: 'delete'): void
}>()
</script>

<template>
    <div v-if="show" class="options-menu">
        <button v-if="!taskDone" class="option-btn done" @click="$emit('markDone')">
            <Check :size="18"/>
            Mark as Done
        </button>

        <button v-if="!taskDone && addSubTask" class="option-btn add-subtask" @click="$emit('addSubTask')">
            <Plus :size="18"/>
            Add Subtask
        </button>

        <button v-if="!taskDone" class="option-btn edit" @click="$emit('edit')">
            <Pencil :size="18"/>
            Edit
        </button>

        <button v-if="taskDone" class="option-btn undone" @click="$emit('markUndone')">
            <RotateCcw :size="18"/>
            Mark as Undone
        </button>

        <button class="option-btn delete" @click="$emit('delete')">
            <Trash2 :size="18"/>
            Delete
        </button>
    </div>
</template>
