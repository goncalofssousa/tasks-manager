<script setup lang="ts">
import Modal from '../components/Modal.vue'

const props = defineProps<{
  show: boolean
  title: string 
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <Modal :show="show" @close="$emit('cancel')">
    <div class="confirm-modal">

        <div class="confirm-icon">
            ⚠️
        </div>

        <h2> {{ title }}</h2>

        <p>
            This action cannot be undone. Are you sure you want to continue?
        </p>

        <div class="modal-actions">
            <button class="modal-btn cancel" @click="$emit('cancel')">
                Cancel
            </button>

            <button class="modal-btn danger" @click="$emit('confirm')">
                Delete
            </button>
        </div>

    </div>
  </Modal>
</template>

<style scoped>
.confirm-modal {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  padding: 10px;
}

.confirm-icon {
  width: 60px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(255, 77, 79, .12);

  font-size: 1.7rem;

  margin-bottom: 16px;
}

.confirm-modal h2 {
  margin: 0;

  color: white;
  font-size: 1.3rem;
}

.confirm-modal p {
  margin: 12px 0 24px;

  color: var(--color-text-secondary);

  font-size: .95rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  width: 100%;
  gap: 10px;
}

.modal-btn {
  flex: 1;

  padding: 12px;

  border: none;
  border-radius: 10px;

  font-size: .9rem;
  font-weight: 600;

  cursor: pointer;

  transition: .2s;
}

.modal-btn.cancel {
  background: var(--color-primary);

  color: var(--color-text-secondary);
}

.modal-btn.cancel:hover {
  color: white;
}

.modal-btn.danger {
  background: #ff4d4f;

  color: white;
}

.modal-btn.danger:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
</style>