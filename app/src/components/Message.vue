<template>
  <Transition name="toast">
    <div v-if="show" class="toast" :class="props.type">
      <span class="icon">
        {{ icons[props.type] }}
      </span>

      <span class="text">
        {{ props.msg }}
      </span>

      <button class="close" @click="$emit('close')">
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{ 
  show: boolean 
  msg: string 
  type: 'success' | 'error' | 'cancel'
}>()

defineEmits<{ close: [] }>()

const icons = {
  success: '✓',
  error: '✕',
  cancel: '⚠'
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 24px; 
  left: 50%;
  transform: translateX(-50%);
  
  display: flex;
  align-items: center;
  gap: 14px;

  min-width: 320px;
  max-width: 450px; 

  padding: 14px 18px;
  border-radius: 14px;

  background: var(--color-primary-dark, #18181c);
  border: 1px solid rgba(255, 255, 255, .08);
  color: white;

  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  z-index: 9999; 
  box-sizing: border-box;
}

.toast.success { border-color: rgba(22, 163, 74, 0.4); }
.toast.error { border-color: rgba(220, 38, 38, 0.4); }
.toast.cancel { border-color: rgba(245, 158, 11, 0.4); }

.icon {
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success .icon { color: #4ade80; }
.error .icon { color: #f87171; }
.cancel .icon { color: #fbbf24; }

.text {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
}

.close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  color: var(--color-text-secondary, #a1a1aa);
  transition: color 0.2s;
  line-height: 1;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close:hover {
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity .3s cubic-bezier(0.16, 1, 0.3, 1), transform .3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>