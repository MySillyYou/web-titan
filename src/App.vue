<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
  
</script>
<style lang="scss">
  html,body,#app,.common-layout,.el-container{
    height: 100%;
  }
  @media screen and (max-width: 1000px) {
    .header-menu{
      display: none !important;
    }
  }
  .el-card__header{
      padding: 10px !important;
  }
  .subtitle{
    margin-right: 12px;
    margin-bottom: 0;
    color: #000000d9;
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    padding: 12px 0;
  }
  .elrow{
    margin-bottom: 6px;
  }
  body{
    background: rgb(240, 242, 245);
  }
  .el-header{
    background: #fff;
  }
  p{
    margin-bottom: 0.5em;
  }
  .flex{
    display: flex;
  }
</style>