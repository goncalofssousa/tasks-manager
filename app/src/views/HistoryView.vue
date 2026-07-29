<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHistoryStore } from '../stores/history'
import type { Activity } from '../types/history'
import { History, Trash2} from 'lucide-vue-next'
import HistoryFilters from '../components/HistoryFilters.vue'
import { formatTime, formatDate } from '../utils/formats.ts'
import type { Filter } from '../types/filter.ts'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useMessage } from '../composables/useMessage.ts'
import Message from '../components/Message.vue'
import { usePagination } from '../composables/usePagination.ts'
import { getIcon } from '../utils/historyUtils.ts'

const historyStore = useHistoryStore()
const {show, text, type, openMessage} = useMessage()

// filters
const currentFilterValues = ref<string[]>(['all'])

function handleFilterClicked(value: string) {
  page.value = 1
  if (value === 'all') {
      currentFilterValues.value = ['all']
      return
  }
  const index = currentFilterValues.value.indexOf(value)
  
  if(index < 0){
      const indexAll = currentFilterValues.value.indexOf('all')
      if(indexAll >= 0){
      currentFilterValues.value.splice(indexAll,1)
      }
      currentFilterValues.value.push(value)
  } else {
      currentFilterValues.value.splice(index,1)
      if(currentFilterValues.value.length === 0) currentFilterValues.value.push('all')
  }
}

const filterOptions: Filter[] = [
  { value: 'all', label: 'All' },
  { value: 'task_created', label: 'Created' },
  { value: 'task_completed', label: 'Completed' },
  { value: 'task_removed', label: 'Removed' },
  { value: 'task_undone', label: 'Reopened' },
  { value: 'task_updated', label: 'Updated' },
  { value: 'task_favourite', label: 'Toggle Favourite' }
]


const filteredHistory = computed(() => {
  const filters = currentFilterValues.value

  if (filters.includes('all')) {
    return historyStore.history
  }

  return historyStore.history.filter(activity => filters.includes(activity.type))
})

// pagination

const {page, totalPages, nextPage, prevPage, paginatedHistory} = usePagination(filteredHistory, 10)

// group by label 
const groupedHistory = computed(() => {
  const groups: Record<string, Activity[]> = {}
  for (const activity of paginatedHistory.value) {
    const day = activity.date.split('T')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(activity)
  }
  return groups
})


// modal
const showModal = ref<boolean>(false)

function handleClearClick(){
  showModal.value = true; 
}
  
function closeModal(){
  showModal.value = false; 
}

function handleConfirm(){
  if(currentFilterValues.value.at(0) === 'all') historyStore.clearAllHistory()
  else {
    historyStore.clearFilteredHistory(currentFilterValues.value)
  }
  closeModal()
  openMessage("success", "History cleared sucessfully")
}

function handleCancel(){
  closeModal()
  openMessage("cancel", "History clearing cancelled")
}
</script>

<template>
  <div class="page">

    <div class="header">
      <h1>History</h1>
      <button  class="clear-btn" @click="handleClearClick" :disabled="filteredHistory.length === 0">
        <Trash2 :size="16" />
        Clear {{ currentFilterValues.find(t => t === 'all') ? 'All' : `Filtered (${filteredHistory.length})` }}
      </button>
    </div>

    <HistoryFilters  :all-filters="filterOptions" :current-filter-values="currentFilterValues" @clicked-filter="handleFilterClicked"/>
  
    <div v-if="filteredHistory.length === 0" class="empty-state">
      <History :size="40" />
      <p>No activity yet</p>
    </div>

    <div v-else class="timeline">
      <div v-for="(activities, date) in groupedHistory" :key="date" class="day-group">

        <div class="day-label">{{ formatDate(date) }}</div>

        <div class="day-items">
          <div v-for="activity in activities" :key="activity.id" class="activity-item" :class="activity.class">
            <div class="activity-icon">
              <component :is="getIcon(activity.type)" :size="16" />
            </div>

            <div class="activity-content">
              <p class="activity-text">{{ activity.label }}</p>
              <p class="activity-time">{{ formatTime(activity.date) }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="page === 1" class="page-btn">Previous</button>
      <span>Page {{ page }} of {{ totalPages }} - {{ filteredHistory.length }} results</span>
      <button @click="nextPage" :disabled="page === totalPages" class="page-btn">Next</button>
    </div>

    <ConfirmModal :show="showModal" :title="'Clear History'" @cancel="handleCancel" @confirm="handleConfirm"/>
    <Message :show="show" :type="type" :msg="text" @close="show = false"/>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 14px;

  border: 1px solid rgba(231, 76, 60, .25);
  border-radius: 10px;

  background: rgba(231, 76, 60, .08);
  color: #e74c3c;

  font-size: .85rem;
  font-weight: 500;
  font-family: Poppins, sans-serif;

  cursor: pointer;
  transition: all .2s ease;
}

.clear-btn:hover {
  transform: translateY(-1px);
  background: rgba(231, 76, 60, .15);
  border-color: rgba(231, 76, 60, .4);
}

.clear-btn:active {
  transform: scale(0.97);
} 

.clear-btn:disabled {
  opacity: .4;
  cursor: not-allowed;

  background: rgba(255,255,255,.04);
  border-color: rgba(255,255,255,.08);

  color: var(--color-text-secondary);
}

.clear-btn:disabled:hover {
  background: rgba(255,255,255,.04);
  border-color: rgba(255,255,255,.08);

  transform: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%; 
  gap: 15px;  
}

/* TIMELINE */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.day-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.day-label {
  font-size: .85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: .04em;
}

.day-items {
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding-left: 14px;
  border-left: 2px solid rgba(255,255,255,.08);
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  padding: 12px 14px;

  background: var(--color-primary-dark);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.06);
}

.activity-icon {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;

  background: rgba(121,111,246,.1);
  color: var(--color-accent);
}

.activity-item.green .activity-icon {
  background: rgba(46, 204, 113, .12);
  color: #2ecc71;
}

.activity-item.red .activity-icon {
  background: rgba(231, 76, 60, .12);
  color: #e74c3c;
}

.activity-item.yellow .activity-icon {
  background: rgba(241, 196, 15, .12);
  color: #f1c40f;
}


.activity-item.blue .activity-icon {
  background: rgba(52, 152, 219, .12);
  color: #3498db;
}


.activity-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.activity-text {
  margin: 0;
  font-size: .88rem;
  color: white;
  word-break: break-word;
}

.activity-time {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
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