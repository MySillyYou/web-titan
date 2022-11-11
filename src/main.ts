import { createApp } from 'vue'
import './style.css'

import 'virtual:windi.css'

// element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './routers';
import piniaStore from './store';

const app = createApp(App);
app.use(piniaStore)
app.use(router)

app.use(ElementPlus)
app.mount('#app')
