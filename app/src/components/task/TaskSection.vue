<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { SearchX, CircleCheckBig, ChevronDown } from 'lucide-vue-next'

import { useTasksStore } from '../../stores/tasks.js'
import type { Task } from '../../types/tasks.js'
import TaskCard from '../task/TaskCard.vue'

const store = useTasksStore()

const props = defineProps<{
  title: string
  tasks: Task[]
  section: 'pending' | 'completed'
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  (e: 'editTask', task: Task): void
  (e: 'addSubTask', task: number): void
  (e: 'removeTask', task: number): void
  (e: 'message', type: 'error' | 'cancel' | 'success', message: string): void
}>()

const expanded = ref(props.section === 'pending')

const isCompleted = computed(() => props.section === 'completed')

function toggleExpanded() {
  if (isCompleted.value) {
    expanded.value = !expanded.value
  }
}

function markAsDone(id: number) {
  store.markAsDone(id)
  emit('message', 'success', 'Task completed successfully')
}

function markAsUnDone(id: number) {
  store.markAsUnDone(id)
  emit('message', 'success', 'Task reopened successfully')
}

function toggleFavourite(id: number) {
  store.toggleFavourite(id)
  emit('message', 'success', 'Favourite toggled sucessfully')
}

const menuOpen = ref(false)

function setMenuOpen(value: boolean) {
  menuOpen.value = value
}

provide('taskMenu', {
  menuOpen,
  setMenuOpen
})
</script>

<template>
  <section>
      <header v-if="isCompleted && tasks.length > 0" class="section-header">
        <div class="section-title">
          <h3>{{ title }}</h3>
          <span class="count-badge">{{ tasks.length }}</span>
        </div>

        <button type="button" class="toggle-btn" :aria-expanded="expanded" @click.stop="toggleExpanded">
          <span class="toggle-text">{{ expanded ? 'Hide' : 'Show' }}</span>
          <ChevronDown class="chevron" :class="{ open: expanded }" :size="16"/>
        </button>
      </header>

      <Transition name="fade" mode="out-in">
        <div v-if="tasks.length === 0 && section === 'pending'" key="empty" class="empty-state">
          <template v-if="hasActiveFilters">
            <div class="empty-icon">
              <SearchX :size="32" />
            </div>

            <p>
              No tasks match these filters.
            </p>
          </template>

          <template v-else>
            <div class="empty-icon success">
              <CircleCheckBig :size="32" />
            </div>

            <p>
              Enjoy your free time — nothing pending.
            </p>
          </template>
        </div>


        <TransitionGroup v-else-if="expanded" key="tasks" name="tasks" tag="div" class="tasks">
          <TaskCard
            v-for="task in tasks"
            :key="task.id"

            :task="task"
            :subTasks="store.subTasksMap[task.id] || []"
            :compact="section === 'completed'"

            @done="markAsDone"
            @undone="markAsUnDone"
            @toggle-favourite="toggleFavourite"
            @delete="$emit('removeTask', $event)"
            @edit="$emit('editTask', $event)"
            @add-sub-task="$emit('addSubTask', $event)"
          />
        </TransitionGroup>

      </Transition>
    </section>
</template>

<style scoped>
section {
  margin-top: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-bottom: 10px;
  margin-bottom: 1rem;

  border-bottom: 1px solid rgba(255,255,255,.08);
}

.section-header.clickable {
  cursor: pointer;
  user-select: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title h3 {
  margin: 0;
  color: var(--color-light);
  font-size: 1.1rem;
  font-weight: 600;
}

.count-badge {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 22px;
  height: 22px;
  padding: 0 6px;

  border-radius: 999px;

  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  color: var(--color-text-secondary);

  font-size: .75rem;
  font-weight: 700;
}

/* TOGGLE BUTTON */
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;

  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;

  color: var(--color-text-secondary);

  font-family: Poppins, sans-serif;
  font-size: .8rem;
  font-weight: 600;

  cursor: pointer;
  transition: all .2s ease;
}

.toggle-btn:hover {
  border-color: rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  color: var(--color-light);
}

.chevron {
  transition: transform .25s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

/* TASKS LIST */
.tasks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .75rem;

  padding: 2.5rem 1rem;

  border: 1px dashed rgba(255,255,255,.1);
  border-radius: 14px;

  background: rgba(255,255,255,.02);

  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state p {
  margin: 0;
  font-size: .9rem;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 56px;
  height: 56px;

  border-radius: 999px;

  background: rgba(255,255,255,.05);
  color: var(--color-text-secondary);
}

.empty-icon.success {
  background: rgba(34,197,94,.1);
  color: #22c55e;
}


.fade-enter-active,
.fade-leave-active {
  transition:
    opacity .25s ease,
    transform .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.tasks-enter-active,
.tasks-leave-active {
  transition:
    opacity .25s ease,
    transform .25s ease;
}


.tasks-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}


.tasks-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.tasks-move {
  transition: transform .25s ease;
}
</style>