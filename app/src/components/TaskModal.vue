<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Modal from '../components/Modal.vue'
import type { Priority, Task } from '../types/tasks.ts'
import { useTasksStore } from '../stores/tasks.ts';

const tasksStore = useTasksStore()

const props = defineProps<{
  show: boolean
  mode: 'create' | 'edit' | 'new-sub-task'
  task?: Task
  mainTaskId?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { title: string; descricao: string; dueDate: string, parentId?: number, priority: Priority | undefined }): void
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

const canSend = computed(() => {
  return (title.value.trim() !== '' && dueDateError.value === '')
})

const dueDateError = computed(() => {
  let parentId: number | undefined

  if (props.mode === 'new-sub-task') {
    parentId = props.mainTaskId
  }

  if (props.mode === 'edit') {
    parentId = props.task?.parentId
  }

  if (!parentId || !dueDate.value) {
    return ''
  }

  const parentDueDate = tasksStore.entities[parentId]?.dueDate

  if (parentDueDate && new Date(dueDate.value) > new Date(parentDueDate)) {
    return `Sub-task due date cannot exceed ${parentDueDate}`
  }

  return ''
})


function submit() {
  if (!canSend.value) return
  emit('submit', {
    title: title.value,
    descricao: descricao.value,
    dueDate: dueDate.value,
    parentId: props.mainTaskId,
    priority: priority.value
  })
}
</script>

<template>
  <Modal :show="show">

    <h2>
      {{ modalTitle }}
    </h2>

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
        <textarea id="desc" v-model="descricao" rows="4" placeholder="Describe your task..."></textarea>
      </div>

      <div class="form-group">
        <label for="date" >Due Date</label>
        <input 
          id="date" type="date" v-model="dueDate" :class="{ error: dueDateError !== '' }"
          :max="props.mainTaskId ? tasksStore.entities[props.mainTaskId]?.dueDate 
                : props.task?.parentId ? tasksStore.entities[props.task.parentId]?.dueDate
                : undefined"
        />
        <p v-if="dueDateError" class="error-text">
          {{ dueDateError }}
        </p>
      </div>

      <div class="form-group">
        <label for="priority">Priority</label>
        <div class="priority-picker">
          <label v-for="option in ['low', 'medium', 'high']" :key="option" class="priority-option" :class="[option, { active: priority === option }]">
            <input id="priority" type="radio" name="priority" :value="option" :checked="priority === option" @click="priority = priority === option ? undefined : option" />
            {{ option.charAt(0).toUpperCase() + option.slice(1) }}
          </label>  
        </div>
      </div>

      <div class="modal-actions">

        <button type="button" class="modal-btn cancel" @click="$emit('close')">
          Cancel
        </button>

        <button type="submit" class="modal-btn confirm" :disabled="!canSend">
          {{ modalSubmitButtonText }}
        </button>

      </div>

    </form>

  </Modal>
</template>

<style scoped>
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

.form-group label {
  font-size: .9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;

  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);

  background: var(--color-primary);
  color: white;

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
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(121,111,246,.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-text-secondary);
}

.required-badge {
  font-size: .7rem;
  padding: 2px 6px;

  border-radius: 999px;

  background: rgba(121,111,246,.15);
  color: var(--color-accent);

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
  border: 1px solid rgba(255,255,255,.08);

  background: var(--color-primary);
  color: var(--color-text-secondary);

  font-size: .85rem;
  font-weight: 600;

  cursor: pointer;
  transition: all .2s ease;
}

.priority-option input {
  display: none;
}

.priority-option:hover {
  color: white;
}

.priority-option.active {
  background: rgba(121, 111, 246, .15);
  border-color: rgba(121, 111, 246, .5);
  color: var(--color-accent);
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
  background: var(--color-accent);
  color: white;

  box-shadow: 0 10px 20px rgba(121,111,246,.25);
}

.modal-btn.confirm:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.modal-btn.confirm:disabled {
  opacity: .4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>