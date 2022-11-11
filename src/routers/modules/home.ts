import { Layout } from "../constant";

import { RouteRecordRaw } from 'vue-router';

const router: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children:[
      {
        path: '',
        redirect: '/console/overview'
      },
      {
        path: 'home',
        component: () => import('@/pages/home/index.vue')
      },
      {
        path: 'login',
        component: () => import('@/pages/home/login.vue')
      }
    ]
  }
]
export default router;