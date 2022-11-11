<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="subtitle">My Missions</span>
      <el-button @click="goAddPage()">Create Task</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-change="onTabChange">
      <el-tab-pane v-for="tab in tabs" :key="tab.value" :label="tab.label" :name="tab.value"></el-tab-pane>
    </el-tabs>
    <el-table :data="taskInfo.list" style="width: 100%">
      <el-table-column prop="cid" label="Request CID" width="180" />
      <el-table-column prop="bandwidth_up" label="Upstream Bandwidth" width="180" />
      <el-table-column prop="bandwidth_down" label="Downlink Bandwidth" />
      <el-table-column prop="time_need" label="Expected Completion Time" />
      <el-table-column prop="address" label="Region" />
      <el-table-column prop="status" label="Current Status" />
      <el-table-column prop="price" label="Bid" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { queryTaskList } from '@/api/console';
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabs = reactive([
  { label: 'All', value: 'All' },
  { label: 'Enabled', value: 'Enabled' },
  { label: 'Completed', value: 'Completed' },
])

const activeName = ref('All')
const taskInfo = ref({
  list: []
})

onMounted(() => {
  initTaskData()
})

function onTabChange () {
  initTaskData()
}

async function initTaskData() {
  taskInfo.value = await queryTaskList({ status: activeName.value })
}

function goAddPage() {
  router.push({ name: 'TaskAdd' })
}
</script>

<style lang="scss" scoped>

</style>
