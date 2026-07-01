<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHistoryStore } from '../stores/history'
import type { Activity, ActivityType } from '../types/history'
import { useTasksStore } from '../stores/tasks'
import { History, PlusCircle, CheckCircle2, Trash2, RotateCcw, CalendarClock, ListChecks } from 'lucide-vue-next'
import Filters from '../components/Filters.vue'

const historyStore = useHistoryStore()
const tasksStore = useTasksStore()

const filter = ref<'all' | ActivityType>('all')
const filterOptions: { value: 'all' | ActivityType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'task_created', label: 'Created' },
  { value: 'task_completed', label: 'Completed' },
  { value: 'task_removed', label: 'Removed' },
  { value: 'task_undone', label: 'Reopened' },
  { value: 'deadline_changed', label: 'Deadline Changed' }
]

function setFilter(value: 'all' | ActivityType) {
  filter.value = value
}

const filteredHistory = computed(() => {
  if (filter.value === 'all') return historyStore.history
  return historyStore.history.filter(a => a.type === filter.value)
})

const groupedHistory = computed(() => {
  const groups: Record<string, Activity[]> = {}
  for (const activity of filteredHistory.value) {
    const day = activity.date.split('T')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(activity)
  }
  return groups
})


function getMainTaskName(mainTaskId?: number): string | null {
  if (mainTaskId === undefined) return null
  const mainTask = tasksStore.tasks.find(t => t.id === mainTaskId)
  return mainTask ? mainTask.title : null
}

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
  const mainTaskName = getMainTaskName(activity.mainTaskId)

  switch (activity.type) {
    case 'task_created':
      return mainTaskName 
            ? `Created subtask "${activity.taskName}" in main task "${mainTaskName}"` 
            :`Created task "${activity.taskName}"`

    case 'task_completed': 
      return mainTaskName
            ? `Completed subtask "${activity.taskName}" in main task  "${mainTaskName}"`
            : `Completed task "${activity.taskName}"`

    case 'task_removed':
      return mainTaskName
            ? `Removed subtask "${activity.taskName}" in main task  "${mainTaskName}"`
            : `Removed task "${activity.taskName}"`

    case 'task_undone':
      return mainTaskName
            ? `Reopened subtask "${activity.taskName}" in main task  "${mainTaskName}"`
            : `Reopened task "${activity.taskName}"`

    case 'deadline_changed':
      return mainTaskName 
              ? `Changed deadline for subtask "${activity.taskName}" in task ${mainTaskName}`
              : `Changed deadline for task "${activity.taskName}"`

    default:
      return activity.taskName
  }
}

function formatDate(date: string): string {
  const inputDate = new Date(date)
  const today = new Date()

  today.setHours(0, 0, 0, 0)
  inputDate.setHours(0, 0, 0, 0)

  const diffDays = Math.floor((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'

  if (diffDays <= 7) return 'Last week'
  if (diffDays <= 30) return 'Last month'
  if (diffDays <= 365) return 'Last year'

  return inputDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="page">

    <div class="header">
      <h1>History</h1>
      <button class="clear-btn" @click="historyStore.clearHistory()">
        <Trash2 :size="16" />
        Clear
      </button>
    </div>

    <Filters :all-filters="filterOptions" :current-filter-value="filter" @update-filter="setFilter"/>
  
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