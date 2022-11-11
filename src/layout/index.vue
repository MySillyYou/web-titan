<template>
 <div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
 
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import Header from './components/header.vue'
</script>


<style lang='scss' scoped>
.el-header {
  --el-header-padding: 0px;
}

.el-main {
  --el-main-padding: 8px
}
</style>