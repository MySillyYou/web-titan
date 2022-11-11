<template>
  <div>
    <div>
      <div class="mb-20px">
        <span>Total number of accelerated tasks：{{ taskInfo.num_all }}</span>
        <span class="ml-36px"
          >Contribute broadband traffic：{{ taskInfo.file_size_all }}MB</span
        >
      </div>
      <el-table :data="taskInfo.data_list" style="width: 100%">
        <el-table-column prop="date" label="Date" />
        <el-table-column prop="num" label="Number of tasks" />
        <el-table-column prop="file_size" label="Contribution bandwidth" />
        <el-table-column prop="price" label="Profit" />
        <el-table-column label="Operation">
          <template #default="{ row }">
            <el-link @click="openTableModal(row)"> Details </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="state.visibleTable">
    <template #header>
      <span>日期：2022-06-06</span>
    </template>
    <el-table :data="state.taskDetail" style="width: 100%">
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="file_size" label="文件名" />
      <el-table-column prop="bandwidth_up" label="文件大小" />
      <el-table-column prop="bandwidth_up" label="上行速度" />
      <el-table-column prop="bandwidth_down" label="下行速度" />
      <el-table-column prop="ip_address" label="目的地址" />
      <el-table-column prop="created_at" label="⽂件创建⽇期" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getTaskList, getTaskDetail } from '@/api/console'

const props = defineProps({
  deviceId: {
    type: String,
    default: '',
  },
})

const taskInfo = ref({
  data_list: [],
  file_size_all: 0,
  num_all: 0,
})

const state = reactive({
  taskDetail: [],
  visibleTable: false,
})

async function openTableModal(row) {
  const res = await getTaskDetail({ device_id: props.deviceId, date: row.date })
  state.taskDetail = res.data_list
  state.visibleTable = true
}

onMounted(async () => {
  taskInfo.value = await getTaskList({ device_id: props.deviceId })
})
</script>
<script lang="ts">
export default {
  name: 'Task',
  inheritAttrs: true,
}
</script>

<style lang="scss" scoped></style>
