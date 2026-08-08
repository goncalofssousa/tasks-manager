<script setup lang="ts">
import { Plus, Tags, Trash2, X } from 'lucide-vue-next';
import { useTagsStore } from '../../stores/tags';
import { computed, ref } from 'vue';
import { usePagination } from '../../composables/usePagination';

const tagsStore = useTagsStore() 

const props = defineProps<{
    show:boolean
}>()

const emit = defineEmits<{
    close: [msg?: string]
}>()

const newTag = ref<string>('')

const canSend = computed(() => {
    return newTag.value.trim() !== '' && newTag.value.length <= 20
})

function addTag(){
    if(!canSend.value) return
    tagsStore.addTag(newTag.value)
    newTag.value = ''
}

const tags = computed(() => {
  return Object.values(tagsStore.tags)
})

const {page, totalPages, nextPage, prevPage, paginated: paginatedTags} = usePagination(tags, 5)

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
        <input v-model="newTag" type="text" placeholder="New Tag..." maxlength="20"/>
        <button class="add-tag" @click="addTag" :disabled="!canSend">
          <Plus :size="16" />
          Create
        </button>
      </div>

      <div class="tags-section">
        <div v-if="tagsStore.tagsLength > 0" class="tags-section-header">
          <span >Your Tags</span>
          <span class="tag-count">{{ tagsStore.tagsLength }}</span>
        </div>

        <div v-else class="tags-empty">
          <Tags :size="28" class="tags-empty-icon" />
          <span>You have no tags created</span>
        </div>


        <ul class="tags-list">
          <li v-for="tag in paginatedTags" :key="tag.label">
            <div class="left">
              <Tags :size="16" class="tags-empty-icon" />
              <span class="tag-label">{{ tag.label }}</span>
            </div>
            <button class="delete-btn" @click="tagsStore.removeTag(tag.label)">
              <Trash2 :size="14" />
            </button>
          </li>
        </ul>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button @click="prevPage" :disabled="page === 1" class="page-btn">Previous</button>
        <button @click="nextPage" :disabled="page === totalPages" class="page-btn">Next</button>
     </div>
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
  max-width: 50vh;
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
  flex: 2;
  min-width: 0;
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
  flex: 1;
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

.tags-list li .left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags-section-header {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 0 2px;

  color: var(--color-text-secondary);
  font-size: .7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.tag-count {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 18px;
  height: 18px;
  padding: 0 5px;

  border-radius: 6px;

  background: #27272a;
  color: var(--color-text-secondary);

  font-size: .65rem;
}

.tags-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 24px 12px;

  color: var(--color-text-secondary);
  font-size: .8rem;
  font-weight: 500;
  text-align: center;
}

.tags-empty-icon {
  color: var(--color-text-secondary);
  opacity: .5;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 5px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.tags-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 34px;
  padding: 5px 6px 5px 10px;

  background: #18181b;
  border: 1px solid rgba(255,255,255,.04);
  border-radius: 8px;

  transition: background .15s ease;
}

.tags-list li:hover {
  background: #202023;
}

.tag-label {
  color: var(--color-light);
  font-size: .8rem;
  font-weight: 500;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 20px;
}

.page-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 14px;

  border-radius: 10px;

  border: 1px solid rgba(255,255,255,.08);

  background: var(--color-primary-dark);

  color: var(--color-text-secondary);

  font-family: Poppins, sans-serif;
  font-size: .85rem;
  font-weight: 600;

  cursor: pointer;

  transition: all .2s ease;
}

.page-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.page-btn.active {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(121,111,246,.1);
}

.page-btn:disabled {
  opacity: .4;
  cursor: not-allowed;

  background: rgba(255,255,255,.04);
  border-color: rgba(255,255,255,.08);

  color: var(--color-text-secondary);
}
</style>