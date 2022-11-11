<template>
  <div class="flex items-center header">
    <div class="logo"><img src="@/assets/image/logo.png"></div>
    <!-- <el-menu
      class="header-menu"
      mode="horizontal"
      default-active="/home"
      router
      :ellipsis="false"
    >
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item index="/pro">产品</el-menu-item>
      <el-menu-item index="3">文档</el-menu-item>
      <el-menu-item index="4">APP</el-menu-item>
      <el-menu-item index="5">常见问题</el-menu-item>
      <el-menu-item index="6">帮助中心</el-menu-item>
      <el-menu-item index="7">关于我们</el-menu-item>
    </el-menu> -->
    <div class="flex-grow"></div>
    <div >
      <el-dropdown v-if="address">
        <el-button type="primary" @click="router.push('/console/personalCenter')">
          {{formatHash(address)}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button @click="router.push('/console/overview')" style="margin-left: 20px">Console</el-button>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { formatHash } from '@/utils/index';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { ArrowDown } from '@element-plus/icons-vue'
const router = useRouter();
const route = useRoute();
const userStore = useUserStore()
let address = computed(() => userStore.address)
const logout = () => {
  userStore.$patch((state) => {
    state.address = ''
  })
  router.replace('/login');
}
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid #ccc;
  padding: 0 20px;
  height: 60px;
  .logo {
    width: 100px;
  }
}
:deep(.el-menu) {
 border-bottom: none; 
}
</style>
