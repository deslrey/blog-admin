import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/global.css'
// import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'
import { zhCn } from 'element-plus/es/locale/index.mjs'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
    locale: zhCn
})

app.mount('#app')
