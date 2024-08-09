import { createRouter, createWebHistory } from 'vue-router'

import info from '../views/info.vue'
import add from '../views/add.vue'
import home from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/info',
      name: 'info',
      component: info
    },
    {
      path: '/add',
      name: 'add',
      component: add
    }        
  ]
})

export default router
