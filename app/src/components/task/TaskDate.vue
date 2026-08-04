<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '../../types/tasks';
import { getDueState, getTimeSinceOverdue } from '../../utils/taskState';
import { formatSimple } from '../../utils/formats';
import { Calendar } from 'lucide-vue-next';

const props = defineProps<{
    task: Task
}>()

const dueState = computed(() => getDueState(props.task))
const timeSinceOverdue = computed(() => getTimeSinceOverdue(props.task))
</script>

<template>
    <div class="date">
        <div class="date-content">
            <Calendar :size="12" />

            <p v-if="!task.done && task.dueDate">
                <strong>Due Date:</strong>
                {{ formatSimple(task.dueDate) }}
            </p>

            <p v-else-if="task.doneDate">
                <strong>Completed on:</strong>
                {{ formatSimple(task.doneDate) }}
            </p>
        </div>

        <p v-if="timeSinceOverdue" class="warning overdue-warning">
            ⚠ {{ timeSinceOverdue }}
        </p>

        <p v-else-if="dueState === 'today'" class="warning today-warning">
            ⚠ Due today
        </p>
    </div>
</template>


<style>
.date {
  display:flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap:wrap;
  gap:6px;
  width:max-content;    
}


.date-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-wrap:wrap;
  width:max-content; 
  color:var(--color-text-secondary);
  font-size:.8rem;
  background:rgba(255,255,255,.04);
  border-radius:6px;
  padding: 4px 8px;
}


.date p {
  margin:0;
}


.date-content.done {
  color:#22c55e;
  background:rgba(34,197,94,.12);
}

.warning {
  padding:3px 8px;
  border-radius:6px;
  font-size:.8rem;
  font-weight:500;
}

.overdue-warning {
  color:#ef4444;
  background:transparent;
}

.today-warning {
  color:#f59e0b;
  background:transparent;
}



@media (max-width: 600px) {
  .date{
    display: flex;
    flex-direction: column;
  }
}
</style>