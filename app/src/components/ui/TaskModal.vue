<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ModalAction, Priority, Task, TaskSubmitData } from '../../types/tasks.ts'
import { useTasksStore } from '../../stores/tasks.ts'
import { Tags, X } from 'lucide-vue-next'
import { useTagSelector } from '../../composables/useTagSelector.ts'
import { useTagsStore } from '../../stores/tags.ts'

const tasksStore = useTasksStore()
const tagsStore = useTagsStore()

const props = defineProps<{
  show: boolean
  mode: ModalAction
  task?: Task
  mainTaskId?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: TaskSubmitData): void
}>()

const PRIORITY_OPTIONS: Priority[] = ['low', 'medium', 'high']

const title = ref('')
const descricao = ref('')
const dueDate = ref('')
const priority = ref<Priority | undefined>(undefined)

const modalConfig: Record<ModalAction, { title: string; button: string }> = {
  create: { title: 'New Task', button: 'Add Task' },
  edit: { title: 'Edit Task', button: 'Save Changes' },
  'new-sub-task': { title: 'New Sub Task', button: 'Add Sub Task' }
}

const modalTitle = computed(() => modalConfig[props.mode].title)
const modalSubmitButtonText = computed(() => modalConfig[props.mode].button)

const {
  selectedTags,
  showTagDropdown,
  availableTags,
  canAdd,
  toggleTag,
  reset: resetTags
} = useTagSelector()

watch(() => props.show, (open) => {
  if (!open) return

  if (props.mode === 'edit' && props.task) {
    title.value = props.task.title
    descricao.value = props.task.descricao ?? ''
    dueDate.value = props.task.dueDate ?? ''
    priority.value = props.task.priority ?? undefined
    resetTags(props.task.tagIds ?? [])
    return
  }
})

const maxDueDate = computed(() => {
  if (props.mainTaskId) return tasksStore.entities[props.mainTaskId]?.dueDate
  if (props.task?.parentId) return tasksStore.entities[props.task.parentId]?.dueDate
  return undefined
})

const showPriorityAndTags = computed(() => props.mode !== 'new-sub-task' && props.mainTaskId === undefined)

const canSend = computed(() => title.value.trim() !== '')

function togglePriority(option: Priority) {
  priority.value = priority.value === option ? undefined : option
}

function clear() {
  title.value = ''
  descricao.value = ''
  dueDate.value = ''
  priority.value = undefined
  resetTags()
}

function submit() {
  if (!canSend.value) return

  const payload: TaskSubmitData = {
    title: title.value,
    descricao: descricao.value,
    dueDate: dueDate.value,
    parentId: props.mainTaskId,
    priority: priority.value,
    tagIds: selectedTags.value
  }

  clear()
  emit('submit', payload)
}

function handleCancel() {
  clear()
  emit('close')
}
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <div class="header">
        <h2>{{ modalTitle }}</h2>
        <button class="close-btn" @click="handleCancel">
          <X :size="16" />
        </button>
      </div>

      <form class="task-form" @submit.prevent="submit">

        <div class="form-group">
          <label for="title">
            Title
            <span class="required-badge">Required</span>
          </label>
          <input id="title" v-model="title" placeholder="Task title..." />
        </div>

        <div class="form-group">
          <label for="desc">Description</label>
          <textarea id="desc" v-model="descricao" placeholder="Describe your task..."></textarea>
        </div>

        <div class="form-group">
          <label for="date">Due Date</label>
          <input id="date" type="date" v-model="dueDate" :max="maxDueDate" />
        </div>

        <div v-if="showPriorityAndTags" class="form-group">
          <p>Priority</p>
          <div class="priority-picker">
            <button
              v-for="option in PRIORITY_OPTIONS"
              :key="option"
              type="button"
              class="priority-option"
              :class="[option, { active: priority === option }]"
              @click="togglePriority(option)"
              @keydown.enter.prevent="togglePriority(option)"
            >
              {{ option.charAt(0).toUpperCase() + option.slice(1) }}
            </button>
          </div>
        </div>

        <div v-if="showPriorityAndTags" class="form-group">
          <div class="tag-section-title">
            <p>Tags</p>
            <p class="tag-hint">Max 3</p>
          </div>

          <div class="tag-selector">
            <span v-for="tagKey in selectedTags" :key="tagKey" class="tag-chip" :style="{ '--tag-color': tagsStore.tags[tagKey].color }">
              <Tags :size="14" />
              {{ tagsStore.tags[tagKey].label }}
              <button type="button" @click="toggleTag(tagKey)">
                <X :size="12" />
              </button>
            </span>

            <button v-if="canAdd" type="button" class="tag-add-btn" @click="showTagDropdown = !showTagDropdown">
              + Add tag
            </button>
          </div>

          <div v-if="showTagDropdown" class="tag-dropdown">
            <button v-for="tag in availableTags" :key="tag.key" type="button" class="tag-option" :style="{ '--tag-color': tag.color }" @click="toggleTag(tag.key)">
              <Tags :size="14" />
              {{ tag.label }}
            </button>

            <p v-if="availableTags.length === 0" class="tag-empty-text">
              No tags yet — create some in Tag Manager
            </p>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="modal-btn cancel" @click="handleCancel">
            Cancel
          </button>

          <button type="submit" class="modal-btn confirm" :disabled="!canSend">
            {{ modalSubmitButtonText }}
          </button>
        </div>

      </form>
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
  max-height: 70vh;
  overflow-y: auto;
  background: var(--color-primary-dark);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
}

.close-btn:hover {
  color: var(--color-light);
  background: rgba(255, 255, 255, 0.08);
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label,
.form-group p {
  font-size: .9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  background: #101012;
  border: 1px solid rgba(255,255,255,.08);
  color: var(--color-light);
  font-size: .95rem;
  font-family: Poppins, sans-serif;
  transition: all .2s ease;
}

.form-group textarea {
  resize: none;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255,255,255,.08);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-text-secondary);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.required-badge {
  font-size: .7rem;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  color: white;
  font-weight: 500;
}

/* priority picker */
.priority-picker {
  display: flex;
  gap: 8px;
}

.priority-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  border-radius: 12px;
  background: #101012;
  border: 1px solid rgba(255,255,255,.08);
  color: var(--color-text-secondary);
  font-size: .85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
}

.priority-option:hover {
  color: white;
  border-color: rgba(255,255,255,.18);
}

.priority-option.active {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.22);
  color: white;
}

.tag-section-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tag-hint {
  margin-top: 0.1rem;
  padding: 0 2px;
  color: var(--color-text-secondary);
  font-size: .65rem;
  font-weight: 500;
  opacity: .6;
}

.tag-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px 4px 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tag-color) 12%, #27272a);
  border: 1px solid color-mix(in srgb, var(--tag-color) 25%, transparent);
  color: var(--color-light);
  font-size: .75rem;
  font-family: Poppins, sans-serif;
  font-weight: 500;
}

.tag-chip > svg {
  color: var(--tag-color);
}

.tag-chip button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.tag-chip button:hover {
  color: #ef4444;
  background: rgba(239,68,68,.1);
}

.tag-add-btn {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px dashed rgba(255,255,255,.18);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: .75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
}

.tag-add-btn:hover {
  color: white;
  border-color: rgba(255,255,255,.32);
}

.tag-dropdown {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  background: #101012;
  border: 1px solid rgba(255,255,255,.08);
}

/* usa a cor da própria tag, igual ao tag-chip, em vez de cinzento fixo */
.tag-option {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--tag-color) 25%, transparent);
  background: color-mix(in srgb, var(--tag-color) 10%, #18181b);
  color: var(--color-text-secondary);
  font-size: .75rem;
  font-weight: 500;
  font-family: Poppins, sans-serif;
  cursor: pointer;
  transition: all .2s ease;
}

.tag-option > svg {
  color: var(--tag-color);
}

.tag-option:hover {
  background: color-mix(in srgb, var(--tag-color) 20%, #18181b);
  border-color: var(--tag-color);
  color: white;
}

.tag-empty-text {
  font-family: Poppins, sans-serif;
  font-size: .75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

/* buttons */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.modal-btn {
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  font-size: .95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
}

.modal-btn.cancel {
  background: transparent;
  color: var(--color-text-secondary);
}

.modal-btn.cancel:hover {
  color: white;
  transform: translateY(-1px);
}

.modal-btn.confirm {
  background: #27272a;
  color: #fafafa;
  border: 1px solid rgba(255,255,255,.08);
}

.modal-btn.confirm:hover {
  background: #3f3f46;
  border-color: rgba(255,255,255,.18);
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.modal-btn.confirm:disabled {
  opacity: .4;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 600px) {
  .modal {
    max-width: 320px;
  }
}

</style>