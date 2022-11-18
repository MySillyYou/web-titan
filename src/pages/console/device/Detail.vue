<template>
  <div>
    <div class="m-b-16px">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/console/device' }">
          Device Management
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{deviceInfo.device_name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="mb-12px">
      <el-descriptions :column="5">
        <template #title>
          <span>{{deviceInfo.device_name}}</span>
          <el-button size="small" class="ml-12px" @click="openModal()">View details</el-button>
        </template>
        <el-descriptions-item label="Region">{{deviceInfo.ip_location}}</el-descriptions-item>
        <el-descriptions-item label="Network type">{{deviceInfo.network_type}}</el-descriptions-item>
        <el-descriptions-item label="Online time">{{deviceInfo.today_online_time}}</el-descriptions-item>
        <el-descriptions-item label="Device Diagnostics">
          <el-tag type="success" size="small">{{deviceInfo.work_status}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item></el-descriptions-item>
        <el-descriptions-item label="Cumulative Earnings">{{deviceInfo.cumu_profit}}Fil</el-descriptions-item>
        <el-descriptions-item label="Today's Earnings">{{deviceInfo.today_profit}}Fil</el-descriptions-item>
        <el-descriptions-item label="Yesterday's Earnings">{{deviceInfo.yesterday_income}}Fil</el-descriptions-item>
        <el-descriptions-item label="Last 7 Days Earnings">{{deviceInfo.seven_days_profit}}Fil</el-descriptions-item>
        <el-descriptions-item label="Last 30 Days Earnings">
          {{deviceInfo.month_profit}}Fil
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-tabs v-model="activeName">
      <el-tab-pane label="Real time monitoring" name="first" lazy>
        <real-time :deviceId="deviceId"></real-time>
      </el-tab-pane>
      <el-tab-pane label="Historical data diagnosis" name="second" lazy>
        <history :deviceId="deviceId"></history>
      </el-tab-pane>
      <el-tab-pane label="Task monitoring" name="third" lazy>
        <task :deviceId="deviceId"></task>
      </el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog v-model="state.visible">
    <template #header>
      <span>{{deviceInfo.device_name}}</span>
    </template>
    <div>
      <el-descriptions title="essential information">
        <el-descriptions-item label="Equipment system：">{{deviceInfo.system_version}}</el-descriptions-item>
        <el-descriptions-item label="product type：">{{deviceInfo.product_type}}</el-descriptions-item>
        <el-descriptions-item label="Add Date：">{{deviceInfo.created_at}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="Network information">
        <el-descriptions-item label="Internet IP：">{{deviceInfo.external_ip}}</el-descriptions-item>
        <el-descriptions-item label="IIP belongs to：">{{deviceInfo.ip_location}}</el-descriptions-item>
        <el-descriptions-item label="Intranet IP：">{{deviceInfo.internal_ip}}</el-descriptions-item>
        <el-descriptions-item label="MAC address：">{{deviceInfo.mac_location}}</el-descriptions-item>
        <el-descriptions-item label="NAT Type：">{{deviceInfo.nat_type}}</el-descriptions-item>
        <el-descriptions-item label="UPNP：">{{deviceInfo.upnp}}</el-descriptions-item>
        <el-descriptions-item label="Packet loss rate：">{{deviceInfo.pkg_loss_ratio}}</el-descriptions-item>
        <el-descriptions-item label="Delayed：">{{deviceInfo.latency}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="Device Information">
        <el-descriptions-item label="Data update time：">{{deviceInfo.updated_at}}</el-descriptions-item>
        <el-descriptions-item label="CPU usage：">{{deviceInfo.cpu_usage}}</el-descriptions-item>
        <el-descriptions-item label="Memory usage：">{{deviceInfo.memory_usage}}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import RealTime from './components/RealTime.vue'
import History from './components/History.vue'
import Task from './components/Task.vue'
import { getDiagnosisHours, queryDevice, getDiagnosisDays } from '@/api/console'
import { useRoute } from 'vue-router'

const route = useRoute()
const { deviceId } = route.query

const deviceInfo = ref({})
const activeName = ref('first')

const state = reactive({
  visible: false,
})

onMounted(async () => {
  const {list = []} = await queryDevice({device_id: deviceId})
  deviceInfo.value = list.find(item => item.device_id === deviceId)
  
  
})

function openModal() {
  state.visible = true
}
</script>
<script lang="ts">
export default {
  name: 'DeviceDetail',
  inheritAttrs: true,
}
</script>

<style lang="scss" scoped>
:deep(.el-descriptions__label) {
  // margin-right: 0;
}

</style>
