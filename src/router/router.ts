import { createRouter, createWebHistory } from 'vue-router'
import TasksView  from '../views/TasksView.vue'
import HistoryView from '../views/HistoryView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', 
            component: TasksView
        },
        {
            path: '/history',
            component: HistoryView
        }
    ]
})

export default router