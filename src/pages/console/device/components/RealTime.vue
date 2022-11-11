<template>
  <el-row :gutter="32">
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">Online today</span>
            <span class="text-sm">{{ now }} Update</span>
          </div>
        </template>
        <div id="barEchart" class="echart"></div>
      </el-card>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">Average packet loss rate of the line today</span>
            <span class="text-sm">{{ now }} Update</span>
          </div>
        </template>
        <div id="lineEchart1" class="echart"></div>
      </el-card>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">Average line delay today</span>
            <span class="text-sm">{{ now }} Update</span>
          </div>
        </template>
        <div id="lineEchart2" class="echart"></div>
      </el-card>
    </el-col>
    <!-- <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">Today's management line NAT</span>
            <span class="text-sm">{{now}} Update</span>
          </div>
        </template>
        <div id="lineEchart3" class="echart"></div>
      </el-card>
    </el-col> -->
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">Disk status today</span>
          </div>
        </template>
        <div class="box text-sm">
          <div class="mb-12px">Disk</div>
          <div class="flex justify-between mb-12px">
            <span class="text-gray-500">Disk Cache</span>
            <span>127.2 G/444.7G</span>
          </div>
          <div class="mb-12px">
            <el-progress
              :show-text="false"
              :stroke-width="22"
              :percentage="80"
              status="warning"
            />
          </div>
          <div class="flex justify-between">
            <span><span class="text-gray-500">Disk content</span> ssd</span>
            <span><span class="text-gray-500">File system</span> 裸盘</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue'
import * as echarts from 'echarts'
import { getDiagnosisDays, getDiagnosisHours } from '@/api/console'
import moment from 'moment'

const props = defineProps({
  deviceId: {
    type: String,
    default: '',
  },
})

const diagnosisHoursInfo = ref<any>({})
const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

onMounted(async () => {
  diagnosisHoursInfo.value = await getDiagnosisHours({
    date: moment(new Date()).format('YYYY-MM-DD'),
    device_id: props.deviceId,
  })
  setBarEchart()
  setLineEchart1()
  setLineEchart2()
  setLineEchart3()
})

function getEchartsData(key: string) {
  const data = unref(diagnosisHoursInfo).daily_income[key] || {}
  const xAxisData = Object.keys(data)
  const seriesData = Object.values(data)
  return { xAxisData, seriesData }
}

function setBarEchart() {
  const { xAxisData, seriesData } = getEchartsData('online')
  var barEchart = echarts.init(document.getElementById('barEchart'))
  // 绘制图表
  barEchart.setOption({
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: 'Time（Min）',
    },
    grid: {
      left: 40,
      right: 0,
      top: 30,
      bottom: 30,
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  })
}

function setLineEchart1() {
  const { xAxisData, seriesData } = getEchartsData('pkgLoss')
  var barEchart = echarts.init(document.getElementById('lineEchart1'))
  // 绘制图表
  barEchart.setOption({
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: 'Packet loss rate（%）',
    },
    grid: {
      left: 40,
      right: 0,
      top: 30,
      bottom: 30,
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  })
}

function setLineEchart2() {
  const { xAxisData, seriesData } = getEchartsData('latency')
  var barEchart = echarts.init(document.getElementById('lineEchart2'))
  // 绘制图表
  barEchart.setOption({
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: 'Time delay（h）',
    },
    grid: {
      left: 40,
      right: 0,
      top: 30,
      bottom: 30,
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  })
}

function setLineEchart3() {
  const { xAxisData, seriesData } = getEchartsData('natType')
  var barEchart = echarts.init(document.getElementById('lineEchart3'))
  // 绘制图表
  barEchart.setOption({
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: 'NAT',
    },
    grid: {
      left: 40,
      right: 0,
      top: 30,
      bottom: 30,
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  })
}
</script>
<script lang="ts">
export default {
  name: 'RealTime',
  inheritAttrs: true,
}
</script>

<style lang="scss" scoped>
.echart {
  height: 300px;
}
</style>
