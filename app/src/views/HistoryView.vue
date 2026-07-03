<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHistoryStore } from '../stores/history'
import type { Activity, ActivityType } from '../types/history'
import { History, PlusCircle, CheckCircle2, Trash2, RotateCcw, CalendarClock, ListChecks } from 'lucide-vue-next'
import Filters from '../components/Filters.vue'
import { formatTime, formatDate } from '../utils/formats.ts'
import type { Filter } from '../types/filter.ts'
import ConfirmModal from '../components/ConfirmModal.vue'

const historyStore = useHistoryStore()


// filters
const filterOptions: Filter[] = [
  { value: 'task_created', label: 'Created' },
  { value: 'task_completed', label: 'Completed' },
  { value: 'task_removed', label: 'Removed' },
  { value: 'task_undone', label: 'Reopened' },
  { value: 'deadline_changed', label: 'Deadline Changed' }
]

const currentFilterValues = ref<string[]>(['all'])

function handleFilterClicked(value: string) {
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

// History ti dusplay
const filteredHistory = computed(() => {
  const filters = currentFilterValues.value

  if (filters.includes('all')) {
    return historyStore.history
  }

  return historyStore.history.filter(activity => filters.includes(activity.type))
})

// griouping history by day 
const groupedHistory = computed(() => {
  const groups: Record<string, Activity[]> = {}
  for (const activity of filteredHistory.value) {
    const day = activity.date.split('T')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(activity)
  }
  return groups
})

function getIcon(type: ActivityType) {
  switch (type) {
    case 'task_created':
      return PlusCircle
    case 'task_completed':
      return CheckCircle2
    case 'task_removed':
      return Trash2
    case 'task_undone':
      return RotateCcw
    case 'deadline_changed':
      return CalendarClock
    default:
      return ListChecks
  }
}

function getLabel(activity: Activity): string {
  switch (activity.type) {
    case 'task_created':
      return activity.mainTaskName 
            ? `Created subtask "${activity.taskName}" in main task "${activity.mainTaskName}"` 
            :`Created task "${activity.taskName}"`

    case 'task_completed': 
      return activity.mainTaskName
            ? `Completed subtask "${activity.taskName}" in main task  "${activity.mainTaskName}"`
            : `Completed task "${activity.taskName}"`

    case 'task_removed':
      return activity.mainTaskName
            ? `Removed subtask "${activity.taskName}" in main task  "${activity.mainTaskName}"`
            : `Removed task "${activity.taskName}"`

    case 'task_undone':
      return activity.mainTaskName
            ? `Reopened subtask "${activity.taskName}" in main task  "${activity.mainTaskName}"`
            : `Reopened task "${activity.taskName}"`

    case 'deadline_changed':
      return activity.mainTaskName 
              ? `Changed deadline for subtask "${activity.taskName}" in task ${activity.mainTaskName}`
              : `Changed deadline for task "${activity.taskName}"`

    default:
      return activity.taskName
  }
}

function handleClearClick(){
  showModal.value = true; 
}

const showModal = ref<boolean>(false)

function closeModal(){
  showModal.value = false; 
}

function handleConfirm(){
  if(currentFilterValues.value.at(0) === 'all') historyStore.clearAllHistory()
  else {
    historyStore.clearFilteredHistory(currentFilterValues.value)
  }
  closeModal()
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

    <Filters  :all-filters="filterOptions" :current-filter-values="currentFilterValues" @clicked-filter="handleFilterClicked"/>
  
    <div v-if="filteredHistory.length === 0" class="empty-state">
      <History :size="40" />
      <p>No activity yet</p>
    </div>

    <div v-else class="timeline">
      <div v-for="(activities, date) in groupedHistory" :key="date" class="day-group">

        <div class="day-label">{{ formatDate(date) }}</div>

        <div class="day-items">
          <div v-for="activity in activities" :key="activity.id" class="activity-item" :class="activity.type">
            <div class="activity-icon">
              <component :is="getIcon(activity.type)" :size="16" />
            </div>

            <div class="activity-content">
              <p class="activity-text">{{ getLabel(activity) }}</p>
              <p class="activity-time">{{ formatTime(activity.date) }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <ConfirmModal :show="showModal" :title="'Clear History'" @cancel="closeModal" @confirm="handleConfirm"/>

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

.header h1 {
  margin: 0;
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
  gap: 12px;

  margin-top: 15%;

  color: var(--color-text-secondary);
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
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

.activity-item.task_completed .activity-icon,
.activity-item.subtask_completed .activity-icon {
  background: rgba(46, 204, 113, .12);
  color: #2ecc71;
}

.activity-item.task_removed .activity-icon {
  background: rgba(231, 76, 60, .12);
  color: #e74c3c;
}

.activity-item.task_undone .activity-icon,
.activity-item.subtask_undone .activity-icon {
  background: rgba(241, 196, 15, .12);
  color: #f1c40f;
}

.activity-item.deadline_changed .activity-icon {
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
</style>