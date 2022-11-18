import request from "@/services/index";

// 设备列表
export const queryDevice = (data:any = {}) => {
  return request({
    url: "/api/v0/get_device_info",
    data
  });
};


export const getDiagnosisDays = (data?: any) => {
  return request({
    url: "/api/v0/get_diagnosis_days",
    data
  });
};

export const getDiagnosisHours = (data: any) => {
  return request({
    url: "/api/v0/get_diagnosis_hours",
    data
  });
};

export const getTaskList = (data: any) => {
  return request({
    url: "/api/v0/get_task_list",
    data
  });
};

export const getTaskDetail = (data: any) => {
  return request({
    url: "/api/v0/get_task_detail",
    data
  });
};

// 绑定设备
export const bindingDevice = (data: any) => {
  return request({
    url: "/api/v0/device_biding",
    data
  });
};

export const queryTaskList = (data: any) => {
  return request({
    url: "/api/v0/get_task",
    data
  });
};

export const createTask = (data: any) => {
  return request({
    url: "/api/v0/create_task",
    data
  });
};
