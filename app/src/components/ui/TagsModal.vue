<script setup lang="ts">
import { Plus, Trash2, X } from 'lucide-vue-next';
import { useTagsStore } from '../../stores/tags';
import { computed, ref } from 'vue';

const tagsStore = useTagsStore() 

const props = defineProps<{
    show:boolean
}>()

const emit = defineEmits<{
    close: [msg?: string]
}>()

const newTag = ref<string>('')

const canSend = computed(() => {
    return newTag.value.trim() !== ''
})

function addTag(){
    if(!canSend) return
    tagsStore.addTag(newTag.value)
}

</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <div class="header">
        <h3>Tags</h3>
        <button class="close-btn" @click="$emit('close')">
          <X :size="16" />
        </button>
      </div>

      <div class="tag-create">
        <input v-model="newTag" type="text" placeholder="New Tag..."/>
        <button class="add-tag" @click="addTag" :disabled="!canSend">
          <Plus :size="16" />
          Create
        </button>
      </div>

      <ul class="tags-list">
        <li v-for="tag in tagsStore.tags" :key="tag.label">
          <span>{{ tag.label }}</span>
          <button class="delete-btn" @click="tagsStore.removeTag(tag.label)">
            <Trash2 :size="14" />
          </button> 
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 420px;
  max-height: 70vh;
  overflow-y: auto;
  background: var(--color-primary-dark);
  border-radius: 14px;
  padding: 20px;
}

.header {
  display: flex;
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

.tag-create {
  display: flex;
  gap: 8px;
}

.tag-create input {
  flex: 4.5;
  height: 2rem;
  padding: 0 12px;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: var(--color-light);
  font-size: .85rem;
  font-weight: 600;
  font-family: Poppins, sans-serif;
}

.tag-create input:focus {
  outline: none;
  border-color: white;
}

.add-tag {
  display: flex;
  flex: 1.2;
  align-items: center;
  justify-content: center;
  gap: 5px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: #27272a;
  color: #a1a1aa;

  font-size: .70rem;
  font-weight: 600;
  font-family: Poppins, sans-serif;

  cursor: pointer;
}

.add-tag:hover {
  background: #3f3f46;
}

.add-tag:disabled {
  opacity: .4;
  cursor: not-allowed;
  box-shadow: none;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tags-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: #18181b;
  border-radius: 8px;
  color: var(--color-light);
  font-size: 0.85rem;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #a1a1aa;
  cursor: pointer;
}

.delete-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}
</style>