import './assets/main.css'
import './assets/dx.material.custom-scheme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import config from 'devextreme/core/config'
config({
  licenseKey: import.meta.env.VITE_LICENSE_KEY_DEVEXTREME,
  defaultCurrency: 'IDR',
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
