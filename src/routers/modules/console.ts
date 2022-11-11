import { Layout } from "../constant";

import { RouteRecordRaw } from 'vue-router';

const router: Array<RouteRecordRaw> = [
  {
    path: '/console',
    name: 'Console',
    component: Layout,
    meta: {
      auth: true
    },
    children:[{
      path: '',
      component: () => import('@/pages/console/index.vue'),
      redirect: '/console/overview',
      children: [
        {
          path: 'overview',
          name: 'Overview',
          component: () => import('@/pages/console/overview/index.vue'),
        },
        {
          path: 'device',
          name: 'Device',
          component: () => import('@/pages/console/device/index.vue'),
        },
        {
          path: 'deviceDetail',
          name: 'DeviceDetail',
          component: () => import('@/pages/console/device/Detail.vue'),
          meta: {parentPath: '/console/device'},
        },
        {
          path: 'deviceAdd',
          name: 'DeviceAdd',
          component: () => import('@/pages/console/device/Add.vue'),
          meta: {parentPath: '/console/device'},
        },
        {
          path: 'task',
          name: 'Task',
          component: () => import('@/pages/console/task/index.vue'),
        },
        {
          path: 'taskAdd',
          name: 'TaskAdd',
          component: () => import('@/pages/console/task/Add.vue'),
          meta: {parentPath: '/console/task'},
        },
        {
          path: 'personalCenter',
          name: 'PersonalCenter',
          component: () => import('@/pages/console/personalCenter/index.vue'),
        }
      ]
    }]
  }
]
export default router;