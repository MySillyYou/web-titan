<template>
  <div>
    <div class="m-b-16px">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/console/task' }">
          My Missions
        </el-breadcrumb-item>
        <el-breadcrumb-item>Create a Task</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form class="form" ref="formRef" :model="form" :rules="formRules" label-position="top">
      <el-form-item label="Request CID" prop="cid">
        <el-input v-model="form.cid" placeholder="Please enter the request CID" />
      </el-form-item>
      <el-form-item label="My Uplink Bandwidth" prop="bandwidth_up">
        <el-input v-model="form.bandwidth_up" placeholder="Please enter the uplink bandwidth" />
      </el-form-item>
      <el-form-item label="My Downlink Bandwidth" prop="bandwidth_down">
        <el-input v-model="form.bandwidth_down" placeholder="Please enter the downlink bandwidth" />
      </el-form-item>
      <el-form-item label="Expected Completion Time" prop="time_need">
        <el-date-picker v-model="form.time_need" type="date" value-format="YYYY-MM-DD" style="width: 100%"  placeholder="Please select the desired completion time"/>
      </el-form-item>
      <el-form-item label="Pre-Bid" prop="price">
        <el-input v-model="form.price" placeholder="Please enter a pre-bid price" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit()">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { createTask } from '@/api/console'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter()

const form = ref({})
const formRef = ref()
const formRules = reactive({
  cid: [{ required: true, message: 'Please enter the request CID' }],
  bandwidth_up: [{ required: true, message: 'Please enter the uplink bandwidth' }],
  bandwidth_down: [{ required: true, message: 'Please enter the downlink bandwidth' }],
  time_need: [{ required: true, message: 'Please select the desired completion time' }],
  price: [{ required: true, message: 'Please enter a pre-bid price' }],
})

function onSubmit () {
  formRef.value.validate(async (valid) => {
    if (valid) {
      await createTask(form.value)
      ElMessage.success('添加成功！')
      router.push('/console/task')
    }
  })
}

</script>
<script lang="ts">
export default {
  name: 'TaskAdd',
  inheritAttrs: true,
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
}

:deep(.el-form) {
  .el-input__wrapper {
    width: 100%;
  }
}
</style>
