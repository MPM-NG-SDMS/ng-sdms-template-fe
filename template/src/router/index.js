import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('../views/menu-name/ListDataView.vue'),
    },
    {
      path: '/:id',
      name: 'detail',
      component: () => import('../views/menu-name/detail/DetailDataView.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/menu-name/create/CreateDataView.vue'),
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/menu-name/edit/EditDataView.vue'),
    },
  ],
})

export default router
