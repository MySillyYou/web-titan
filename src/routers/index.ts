import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
const modules: any = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach(key => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});
// function sortRoute(a, b) {
//   return (a.meta?.sort || 0) - (b.meta?.sort || 0);
// }

// routeModuleList.sort(sortRoute);

// 导入生成的路由数据
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routeModuleList],
});
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  // window.scrollTo(0, 0);
  if (to.meta.auth && !userStore.address) {
    
    next('/login');
  } else {
    next();
  }
});

export default router;
