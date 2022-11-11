<template>
  <div>
    <el-card title="Historical income of equipment" class="mb-16px">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-bold">Historical income of equipment</span>
          <div class="flex items-center">
            <el-radio-group v-model="state.timeType" class="mr-2" @change="onTimeTypeChange">
              <el-radio-button label="7">Nearly 7 days</el-radio-button>
              <el-radio-button label="30">Nearly 30 days</el-radio-button>
              <el-radio-button label="90">Nearly 90 days</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="state.time"
              type="daterange"
              placeholder="请选择时间"
              value-format="YYYY-MM-DD"
              start-placeholder="Please select the start time"
              end-placeholder="Please select the end time"
              :disabled-date="disabledDate"
              @change="onTimeRangeChange"
            />
          </div>
        </div>
      </template>
      <div id="mainEchart" class="echart"></div>
    </el-card>

    <el-row :gutter="32">
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{titleName}} Online</span>
            <span class="text-sm">{{now}} Update</span>
          </div>
        </template>
        <div id="h-barEchart" class="echart"></div>
      </el-card>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{titleName}} Average packet loss rate of the line</span>
            <span class="text-sm">{{now}} Update</span>
          </div>
        </template>
        <div id="h-lineEchart1" class="echart"></div>
      </el-card>
    </el-col>
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{titleName}} Average line delay</span>
            <span class="text-sm">{{now}} Update</span>
          </div>
        </template>
        <div id="h-lineEchart2" class="echart"></div>
      </el-card>
    </el-col>
    <!-- <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{titleName}}管理线路NAT</span>
            <span class="text-sm">{{now}} Update</span>
          </div>
        </template>
        <div id="h-lineEchart3" class="echart"></div>
      </el-card>
    </el-col> -->
    <el-col :span="12" :xs="24">
      <el-card class="mb-12px">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">{{titleName}} Disk status</span>
          </div>
        </template>
        <div class="box text-sm">
          <div class="mb-12px">Disk</div>
          <div class="flex justify-between mb-12px">
            <span class="text-gray-500">Disk Cache</span>
            <span>127.2 G/444.7G</span>
          </div>
          <div class="mb-12px">
            <el-progress :show-text="false" :stroke-width="22" :percentage="80" status="warning" />
          </div>
          <div class="flex justify-between">
            <span><span class="text-gray-500">磁盘内容</span> ssd</span>
            <span><span class="text-gray-500">File system</span> 裸盘</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, unref } from 'vue'
import * as echarts from 'echarts'
import moment from 'moment';
import { getDiagnosisDays } from '@/api/console';
import { computed } from '@vue/reactivity';

const props = defineProps({
  deviceId: {
    type: String,
    default: '',
  },
});

const diagnosisHoursInfo = ref<any>({})
const now = ref()
const state = reactive<any>({
  timeType: '7',
  time: '',
  timeTypeMap: {
    7: 'Nearly 7 days',
    30: 'Nearly 30 days',
    90: 'Nearly 90 days'
  }
})

const titleName = computed(() => {
  if(state.time) {
    return state.time[0] + '至' + state.time[1]
  } else {
    return state.timeTypeMap[state.timeType]
  } 
})

onMounted(async () => {
  await getData()
})

async function getData() {
  let params:any = {
    device_id: props.deviceId
  }
  if(state.time) {
    params.from = state.time[0]
    params.to = state.time[1]
  } else {
    params.from = getPreDayDate(state.timeType)
    params.to = moment(new Date()).format('YYYY-MM-DD')
  }
  diagnosisHoursInfo.value = await getDiagnosisDays(params)
  now.value = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  init()
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

function init() {
  setMainChart()
  setBarEchart()
  setLineEchart1()
  setLineEchart2()
  setLineEchart3()
}

function getEchartsData(key: string) {
  const data = unref(diagnosisHoursInfo).daily_income[key] || {}
  const xAxisData = Object.keys(data)
  const seriesData = Object.values(data)
  return { xAxisData, seriesData }
}


function setMainChart() {
  const { xAxisData, seriesData } = getEchartsData('income')
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('mainEchart'))
  // 绘制图表
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
      name: 'Amount（Fil）'
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

function setBarEchart() {
  const { xAxisData, seriesData } = getEchartsData('online')
  const myEchart = echarts.init(document.getElementById('h-barEchart'))
  console.log(barEchart);
  
  // 绘制图表
 myEchart.setOption({
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
  const myEchart = echarts.init(document.getElementById('h-lineEchart1'))
  // 绘制图表
 myEchart.setOption({
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
  const myEchart = echarts.init(document.getElementById('h-lineEchart2'))
  // 绘制图表
 myEchart.setOption({
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
  const myEchart = echarts.init(document.getElementById('h-lineEchart3'))
  // 绘制图表
 myEchart.setOption({
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

function onTimeRangeChange() {
  state.timeType =  null
  getData()
}

function onTimeTypeChange () {
  state.time =  null
  getData()
}

/**
 * 当前时间之前的几天
 * @param number
 * @returns {moment.Moment}
 */
const getPreDayDate = (number: number) => {
  return moment().subtract('days', number).format('YYYY-MM-DD')
}

</script>
<script lang="ts">
export default {
  name: 'History',
  inheritAttrs: true,
}
</script>

<style lang="scss" scoped>

.echart {
  height: 300px;
}
</style>
