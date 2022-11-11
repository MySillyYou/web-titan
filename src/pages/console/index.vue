<template>
  <div class="flex wrap">
    <div class="menu">
      <div
        v-for="menu in menus"
        :key="menu.path"
        class="menu__item"
        :class="{ 'menu__item--active': route.path === menu.path || route.meta.parentPath === menu.path}"
        @click="onMenuClick(menu)"
      >
        {{ menu.name }}
      </div>
    </div>
    <el-scrollbar class="content">
      <router-view></router-view>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menus = reactive([
  { name: 'General Overview', path: '/console/overview' },
  { name: 'Equipment Management', path: '/console/device' },
  { name: 'My Tasks', path: '/console/task' },
  { name: 'Personal Center', path: '/console/personalCenter' },
])

function onMenuClick(menu) {
  router.push(menu.path)
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.menu {
  background: #fff;
  padding: 20px;
  margin-right: 16px;
  border-radius: 4px;
  &__item {
    width: 100px;
    padding: 10px 0;
    // height: 40px;
    // line-height: 40px;
    border-radius: 6px;
    border: 1px solid #eee;
    text-align: center;
    margin-bottom: 12px;
    // margin-right: 20px;
    font-size: 14px;
    cursor: pointer;
    &--active {
      background: #eee;
    }
    &:hover {
      background: #eee;
    }
  }
}

.content {
  flex: 1;
  padding: 16px;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  overflow: auto;
  box-sizing: border-box;
}
</style>
