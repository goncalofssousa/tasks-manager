<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ModalAction, Priority, Task } from '../../types/tasks.ts'
import { useTasksStore } from '../../stores/tasks.ts';
import { Tags, X } from 'lucide-vue-next';
import { useTagsStore } from '../../stores/tags.ts';

const tasksStore = useTasksStore()

const props = defineProps<{
  show: boolean
  mode: ModalAction
  task?: Task
  mainTaskId?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { title: string; descricao: string; dueDate: string, parentId?: number, priority?: Priority  }): void
}>()

const title = ref<string>('')
const descricao = ref<string>('')
const dueDate = ref<string>('')
const priority = ref<Priority | undefined>(undefined)

const modalConfig = {
  create: {
    title: 'New Task',
    button: 'Add Task'
  },

  edit: {
    title: 'Edit Task',
    button: 'Save Changes'
  },

  'new-sub-task': {
    title: 'New Sub Task',
    button: 'Add Sub Task'
  }
}

const modalTitle = computed(
  () => modalConfig[props.mode].title
)

const modalSubmitButtonText = computed(
  () => modalConfig[props.mode].button
)


watch(() => props.show, (open) => {
  if (!open) return

  if (props.mode === 'edit' && props.task) {
    title.value = props.task.title
    descricao.value = props.task.descricao ?? ''
    dueDate.value = props.task.dueDate ?? ''
    priority.value = props.task.priority ?? undefined
    return
  }

  title.value = ''
  descricao.value = ''
  dueDate.value = ''
  priority.value = undefined
})

// Tags
const tagsStore = useTagsStore()

const selectedTags = ref<string[]>([])

const showTagDropdown = ref<boolean>(false)


const availableTags = computed(() => {
  return Object.values(tagsStore.tags).filter(tag => !selectedTags.value.includes(tag.key))
})

const canAdd = computed(() => {
  return selectedTags.value.length < 3
})

function toggleTag(key: string){
  const index = selectedTags.value.indexOf(key)
  if(index === -1) selectedTags.value.push(key)
  else selectedTags.value.splice(index, 1)
  if(selectedTags.value.length >= 3) {
    showTagDropdown.value = false
  }
}

// rest
const canSend = computed(() => {
  return (title.value.trim() !== '')
})

function clear(){
  title.value = ''
  descricao.value = ''
  dueDate.value = ''
  priority.value = undefined
  selectedTags.value = []
}

function submit() {
  if (!canSend.value) return
  const payload = {
    title: title.value,
    descricao: descricao.value,
    dueDate: dueDate.value,
    parentId: props.mainTaskId,
    priority: priority.value
  }
  clear()
  emit('submit', payload)
}

function handleCancel(){
  clear()
  emit('close')
}
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <div class="header">
        <h2>
        {{ modalTitle }}
        </h2>
        <button class="close-btn" @click="$emit('close')">
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
          <label for="date" >Due Date</label>
          <input 
            id="date" type="date" v-model="dueDate" 
            :max="props.mainTaskId ? tasksStore.entities[props.mainTaskId]?.dueDate 
                  : props.task?.parentId ? tasksStore.entities[props.task.parentId]?.dueDate
                  : undefined"
          />
        </div>

        <div v-if="mode !== 'new-sub-task' && mainTaskId === undefined" class="form-group">
          <p>Priority</p>
          <div class="priority-picker">
            <button 
              v-for="option in ['low', 'medium', 'high']" 
              :key="option" 
              class="priority-option" 
              :class="[option, { active: priority === option }]"  
              @click="priority = priority === option ? undefined : option"
              @keydown.enter.prevent="priority = priority === option ? undefined : option"
              >
              {{ option.charAt(0).toUpperCase() + option.slice(1) }}
              
            </button>  
          </div>
        </div>

        <div v-if="mode !== 'new-sub-task' && mainTaskId === undefined" class="form-group">
          <p>Tags</p>

          <div class="tag-selector">
            <span v-for="tagKey in selectedTags" :key="tagKey" class="tag-chip">
              <Tags :size="14"/>
              {{ tagsStore.tags[tagKey].label }}
              <button type="button" @click="toggleTag(tagKey)">
                <X :size="12" />
              </button>
            </span>

            <button type="button" class="tag-add-btn" @click="showTagDropdown = !showTagDropdown" :disabled="!canAdd">
              + Add tag
            </button>
          </div>

          <p class="tag-hint">Max 3 tags</p>

          <div v-if="showTagDropdown" class="tag-dropdown">
            <button v-for="tag in availableTags" :key="tag.key" type="button" class="tag-option" @click="toggleTag(tag.key)">
              <Tags :size="14"/>
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

.form-group label, p {
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

#date.error {
  border: 1px solid #ff4d4f;
}

.error-text {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #ff4d4f;
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

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.tag-hint {
  margin: 0;
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

  padding: 4px 6px 4px 10px;

  border-radius: 999px;
  background: #27272a;
  border: 1px solid rgba(255,255,255,.08);

  color: var(--color-light);
  font-size: .75rem;
  font-family: Poppins, sans-serif;
  font-weight: 600;
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

.tag-add-btn:disabled {
  opacity: .4;
  cursor: not-allowed;
  background: #27272a;
  border-color: rgba(255,255,255,.08);
  color: #71717a;
  transform: none;
  box-shadow: none;
}

.tag-dropdown {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  margin-top: 4px;
  padding: 10px;

  border-radius: 10px;
  background: #101012;
  border: 1px solid rgba(255,255,255,.08);
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;

  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.08);
  background: #18181b;

  color: var(--color-text-secondary);
  font-size: .75rem;
  font-weight: 500;
  font-family: Poppins, sans-serif;

  cursor: pointer;
  transition: all .2s ease;
}

.tag-option:hover {
  border-color: rgba(255,255,255,.2);
  color: white;
}

.tag-option.active {
  background: rgba(255,255,255,.1);
  border-color: white;
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