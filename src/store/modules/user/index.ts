import { defineStore } from 'pinia';
import piniaStore from '@/store/index';

export const useUserStore = defineStore('user', {
  persist: {
    key: 'userStore',
    paths: ['address']
  },
  state: () => ({
    address: ''
  }),
  actions: {
     
  }
})

export function useUserOutsideStore() {
  return useUserStore(piniaStore);
}
