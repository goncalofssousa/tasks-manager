<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { Check, EllipsisVertical, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-vue-next';
import { inject, ref, type Ref } from 'vue';

const taskMenu = inject<{
  menuOpen: Ref<boolean>
  setMenuOpen: (value: boolean) => void
}>('taskMenu')!

const props = defineProps<{
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

const showOptions = ref(false)

function toggleOptions() {
  showOptions.value = !showOptions.value
  taskMenu.setMenuOpen(showOptions.value)
}

const button = ref()
const menu = ref()

onClickOutside(menu, () => {
  showOptions.value = false
   taskMenu.setMenuOpen(false)
}, {
  ignore: [button]
})

function editTask() {
  toggleOptions()
  emit('edit')
}

function deleteTask() {
  toggleOptions()
  emit('delete')
}

function markAsDone() {
  toggleOptions()
  emit('markDone')
}

function markAsUndone() {
  toggleOptions()
  emit('markUndone')
}

function addSubTask() {
  toggleOptions()
  emit('addSubTask')
}
</script>

<template>
    <div class="task-actions" :class="{ 'completed': taskDone }">
        <button ref="button" class="icon-btn" @click="toggleOptions">
            <EllipsisVertical :size="25"/>
        </button>

        <div ref="menu" v-if="showOptions" class="options-menu">
            <button v-if="!taskDone" class="option-btn done" @click="markAsDone">
                <Check :size="18"/>
                Mark as Done
            </button>

            <button v-if="!taskDone && addSubTask" class="option-btn add-subtask" @click="addSubTask">
                <Plus :size="18"/>
                Add Subtask
            </button>

            <button v-if="!taskDone" class="option-btn edit" @click="editTask">
                <Pencil :size="18"/>
                Edit
            </button>

            <button v-if="taskDone" class="option-btn undone" @click="markAsUndone">
                <RotateCcw :size="18"/>
                Mark as Undone
            </button>

            <button class="option-btn delete" @click="deleteTask">
                <Trash2 :size="18"/>
                Delete
            </button>
        </div>
    </div>
</template>

<style>
.task-actions {
  position: relative;
  display: flex;
  align-items: center;
}

.task-actions.completed {
  opacity: 1;
}

.icon-btn {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 8px;

  background: transparent;
  color: #a1a1aa;

  cursor: pointer;

  transition: all .2s ease;
}

.icon-btn:hover {
  background: rgba(255,255,255,.08);
  color: white;
}

.icon-btn:active {
  transform: scale(.95);
}

.icon-btn.favourite {
  color: gold;
}

.icon-btn.favourite:hover {
  color: gold;
}

.icon-btn:hover {
  background: rgba(255,255,255,.06);
  color: var(--color-light);
  transform:translateY(-1px);
  opacity:.85;
}

.options-menu {
  position: absolute;
  opacity: 1;
  top: calc(100%);
  right: 0;

  width: 180px;

  display: flex;
  flex-direction: column;

  background: var(--color-primary-dark);

  border: 1px solid rgba(255,255,255,.06);
  border-radius: 12px;

  box-shadow: 0 12px 30px rgba(0,0,0,.35);

  overflow: hidden;

  z-index: 9999;
}

.option-btn {
  width: 100%;

  display: flex;
  align-items: center;

  padding: 12px 16px;

  border: none;
  background: transparent;

  color: var(--color-light);

  font-family: Poppins, sans-serif;
  font-size: .9rem;

  cursor: pointer;
  gap: 10px; 
  
  transition: .2s;
  opacity: 1;
}

.option-btn:hover {
  background: rgba(255,255,255,.05);
}
</style>