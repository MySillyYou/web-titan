<template>
  <div>
    <div class="m-b-16px">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/console/device' }">
          Device Management
        </el-breadcrumb-item>
        <el-breadcrumb-item>Add Device</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <div class="mb-12px">Please enter the device activation code</div>
      <el-input v-model="form.device_id" placeholder="Please enter the device activation code" style="width: 300px;"></el-input>
      <div>
        <el-checkbox v-model="state.checked">
          <a href=""
            >I have read and agreed to the TianNetwork Agreement</a
          >
        </el-checkbox>
      </div>
      <div class="mt-12px">
        <el-button type="primary" :disabled="!form.device_id" @click="bindDevice()">Add Device</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { bindingDevice } from '@/api/console';
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const form = ref({})

const state = reactive<any>({
    checked: false,
  })

async function bindDevice () {
  if(!state.checked) {
    ElMessage.warning('请先勾选TianNetWork协议')
    return
  }
  await bindingDevice(form.value)
  ElMessage.success('设备添加成功')
  router.replace('/console/device')
}

</script>
<script lang="ts">
export default {
  name: 'DeviceAdd',
  inheritAttrs: true,
}
</script>

<style lang="scss" scoped></style>
