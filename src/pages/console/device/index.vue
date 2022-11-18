<template>
  <div class="device">
    <div class="flex items-center">
      <span class="subtitle">Device Management</span>
      <el-button @click="goAddPage()">Add Device</el-button>
    </div>

    <el-row :gutter="12" class="m-b-12px">
      <el-col class="elrow" :span="4" :xs="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Total number of devices</span>
            </div>
          </template>
          <div>
            <span>{{ deviceInfo.all_devices }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col class="elrow" :span="4" :xs="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Number of Online Devices</span>
            </div>
          </template>
          <div>
            <span>{{ deviceInfo.online }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col class="elrow" :span="4" :xs="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Equipment offline</span>
            </div>
          </template>
          <div>
            <span>{{ deviceInfo.offline }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col class="elrow" :span="4" :xs="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Device Abnormal</span>
            </div>
          </template>
          <div>
            <span>{{ deviceInfo.abnormal }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col class="elrow" :span="4" :xs="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Total Upstream Speed</span>
            </div>
          </template>
          <div>
            <span>{{ deviceInfo.bandwidth_mb }}Kbps</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-table :data="deviceInfo.list" border style="width: 100%">
      <el-table-column prop="device_name" label="Device" width="180">
        <template #default="{ row }">
          <div class="flex">
            <span class="tag" :status="state[row.device_status]"></span>
            {{ row.device_name }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="operator" label="运营商" width="180" /> -->
      <el-table-column prop="ip_location" label="Region" />
      <el-table-column prop="network_type" label="Network Type" />
      <el-table-column prop="today_online_time" label="Online Time" />
      <el-table-column prop="yesterday_income" label="Yesterday's Earnings" />
      <el-table-column prop="cumu_profit" label="Cumulative Earnings" />
      <el-table-column label="Operation" align="center">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="goDetailPage(row)">
            Details
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { queryDevice } from '@/api/console'
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const deviceInfo = ref({
  list: [],
})
const state = reactive({
  statusMap:{
    'online': '#00FF00',
    'offline': '#ff0000',
    'abnormal': '#808080'
  }
})

onMounted(async () => {
  deviceInfo.value = await queryDevice()
  console.log(deviceInfo.value)
})

function goAddPage() {
  router.push({ name: 'DeviceAdd' })
}

function goDetailPage(row) {
  router.push({ name: 'DeviceDetail', query: { deviceId: row.device_id } })
}
</script>

<style lang="scss" scoped>
.device {
  overflow: hidden;
}

.flex {
  display: flex;
  align-items: center;
}

.tag {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
  background: green;
  &[status="online"] {
    
  }
}
</style>
