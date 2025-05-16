import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import * as Elicons from "@element-plus/icons-vue";
import 'element-plus/dist/index.css'


const app=createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

for (const name in Elicons) {
  app.component(name, Elicons[name]);
}

app.mount('#app')





