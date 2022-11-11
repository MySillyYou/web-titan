import ywzRequest from '@/services/index';
export const getBaseInfo = (params?: any) => ywzRequest({url: '/api/get_index_info'});
export const getHomeChart = (params?: any) => ywzRequest({url: '/api/get_user_device_info', data: params});

