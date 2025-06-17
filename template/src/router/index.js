import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '{{DOMAIN_NAME_SLUG}}/',
      name: 'list',
      component: () => import('../views/menu-name/ListDataView.vue'),
    },
    {
      path: '{{DOMAIN_NAME_SLUG}}/:id',
      name: 'detail',
      component: () => import('../views/menu-name/detail/DetailDataView.vue'),
    },
    {
      path: '{{DOMAIN_NAME_SLUG}}/create',
      name: 'create',
      component: () => import('../views/menu-name/create/CreateDataView.vue'),
    },
    {
      path: '{{DOMAIN_NAME_SLUG}}/edit/:id',
      name: 'edit',
      component: () => import('../views/menu-name/edit/EditDataView.vue'),
    },
  ],
})

export default router
