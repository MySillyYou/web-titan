<template>
  <div class="overview">
    <div class="subtitle">Equipment Overview</div>
    <el-row :gutter="12">
      <el-col
        class="elrow"
        :span="4"
        :md="6"
        :sm="8"
        :xs="12"
        :lg="4"
        v-for="(item, index) in state.deviceList"
        :key="index"
      >
        <el-card @click="clickItem(item)" :class="item.url&&'cursor'" class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{ item.label }}</span>
            </div>
          </template>
          <div>
            <span v-if="item.suffix">{{ item.suffix }}</span>
            {{ state.statistics[item.key]  }}
            <span v-if="item.endsuffix">{{ item.endsuffix }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="subtitle">Earnings trend</div>
    <el-card>
      <div class="income-card">
        <div class="select">
          <el-radio-group v-model="state.timeType" class="mr-2">
            <el-radio-button label="Last 7 days" value="7d" />
            <el-radio-button label="Last 30 days" />
            <el-radio-button label="Last 90 days" />
          </el-radio-group>
          <div style="width:240px !important">
            <el-date-picker
              style="width:240px !important"
              v-model="state.time"
              :disabled-date="disabledDate"
              type="daterange"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
          </div>
          
        </div>
        <div id="echart"></div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, watch } from 'vue';
import { getBaseInfo, getHomeChart } from '@/api'
import * as echarts from 'echarts';
import moment from 'moment';
import { useUserStore } from '@/store/modules/user';
import router from '@/routers'
const userStore = useUserStore();
const state = reactive<any>({
  timeType: 'Last 7 days',
  typeStr: {
    'Last 7 days': -7,
    'Last 30 days': -30,
    'Last 90 days': -90,
  },
  time: '',
  statistics: {},
  deviceList: [
    {
      label: 'Cumulative Earnings',
      key: 'cumulative_profit',
      endsuffix: 'Fil',
    },
    {
      label: "Today's Earnings",
      key: 'today_profit',
      endsuffix: 'Fil',
    },
    {
      label: "Yesterday's Earnings",
      key: 'yesterday_profit',
      endsuffix: 'Fil',
    },
    {
      label: 'Last 7 Days Earnings',
      key: 'seven_days_profit',
      endsuffix: 'Fil',
    },
    {
      label: 'Last 30 Days',
      key: 'month_profit',
      endsuffix: 'Fil',
    },
    {
      label: 'Earnings Number of Devices',
      key: 'total_num',
      url: '/console/device'
    },
    {
      label: 'Online Devices',
      key: 'online_num',
      url: '/console/device'
    },
    {
      label: 'Offline',
      key: 'offline_num',
    },
    {
      label: 'Device exceptions',
      key: 'abnormal_num',
    },
    {
      label: 'Total uplink speed',
      key: 'total_bandwidth',
      endsuffix: 'Kbps',
    },
  ],
})
const clickItem = (item: any) => {
  item.url && router.push(item.url)
}
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
const getData = (params: any) => {

  getHomeChart(params).then((res: any) => {
    state.statistics = res;
    initChart(res.daily_income || []);
  })
  // getBaseInfo().then((res: any) => {
  //   if (res.code == 0) {
  //     state.statistics = res.data
  //   }
  //   console.log(res)
  // })
  console.log(params)
}
const initChart = (list: {date: string, income: number}[]) => {
  // @ts-ignore
  var myChart = echarts.getInstanceByDom(document.getElementById('echart'));
  if (myChart == null) {
  // @ts-ignore
      myChart = echarts.init(document.getElementById('echart'));
  }
  
  // 绘制图表
  myChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: list.map((item: {date: string, income: number}) => item.date),
    },
    yAxis: {
      type: 'value',
      // name: '时间（h）'
    },
    grid: {
      top: 40,
      bottom: 30,
      left: 40,
      right: 0
    },
    series: [
      {
        data: list.map((item: {date: string, income: number}) => item.income),
        type: 'line',
        smooth: true,
        name: 'Earnings',
        areaStyle: {},
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
  })
}
watch(() => state.time, (n) => {
  if(n && n.length === 2) {
      getData(
        {
          from: moment(n[0]).format('YYYY-MM-DD'),
          to: moment(n[1]).format('YYYY-MM-DD')
        }
      )
  }
})
watch(() => state.timeType, (n) => {
  state.time = '';
  getData(
    {
      from: moment().add(state.typeStr[n], 'd').format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD')
    }
  )
}, {
  immediate: true
})
onMounted(() => {
  // getBaseInfo().then((res: any) => {
  //   if (res.code == 0) {
  //     state.statistics = res.data
  //   }
  //   console.log(res)
  // })
  // 基于准备好的dom，初始化echarts实例
  
})
</script>

<style lang="scss" scoped>
#echart {
  height: 400px;
}
.overview {
  overflow: hidden;
}
.income-card {
  .select {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
.device-list {
  display: flex;
  flex-wrap: wrap;
  .box-card {
    
    width: 20%;
  }
}
.cursor{
  cursor: pointer;
}
</style>
