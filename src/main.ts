import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Ant from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(Ant)

app.mount('#app')
