<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Modal from '../components/Modal.vue'
import type { Task } from '../stores/tasks'

const props = defineProps<{
  show: boolean
  mode: 'create' | 'edit'
  task?: Task
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { title: string; descricao: string; dueDate: string }): void
}>()

const title = ref('')
const descricao = ref('')
const dueDate = ref('')

watch(() => props.show, (open) => {
    if (open && props.task) {
      title.value = props.task.title
      descricao.value = props.task.descricao
      dueDate.value = props.task.dueDate ?? ''
    }

    if (open && !props.task) {
      title.value = ''
      descricao.value = ''
      dueDate.value = ''
    }
  }
)

const canSend = computed(() => {
  return title.value.trim() !== '' && descricao.value.trim() !== ''
})

function submit() {
  if (!canSend.value) return

  emit('submit', {
    title: title.value,
    descricao: descricao.value,
    dueDate: dueDate.value
  })
}
</script>

<template>
  <Modal :show="show" @close="$emit('close')">

    <h2>
      {{ mode === 'edit' ? 'Edit Task' : 'New Task' }}
    </h2>

    <form class="task-form" @submit.prevent="submit">

      <div class="form-group">
        <label>Title</label>
        <input v-model="title" placeholder="Task title..." />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="descricao" rows="4" placeholder="Describe your task..."></textarea>
      </div>

      <div class="form-group">
        <label>Due Date</label>
        <input type="date" v-model="dueDate" />
      </div>

      <div class="modal-actions">

        <button
          type="button"
          class="modal-btn cancel"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="modal-btn confirm"
          :disabled="!canSend"
        >
          {{ mode === 'edit' ? 'Save Changes' : 'Add Task' }}
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