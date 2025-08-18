import './assets/main.css'
import './assets/dx.material.custom-scheme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import config from 'devextreme/core/config'
import i18n from './lib/i18n'
config({
  licenseKey: import.meta.env.VITE_LICENSE_KEY_DEVEXTREME,
  defaultCurrency: 'IDR',
})

const app = createApp(App)

app.use(i18n)

const originalSetItem = localStorage.setItem
localStorage.setItem = function (key, value) {
  originalSetItem.apply(this, arguments)
  window.dispatchEvent(
    new StorageEvent('storage', {
      key,
      newValue: value,
      storageArea: localStorage,
      url: window.location.href,
    }),
  )
}

// Store the handler so it can be removed later
window._storageEventHandler = function (event) {
  if (event.key === 'locale' && event.newValue) {
    i18n.global.locale.value = event.newValue
  }
}
window.addEventListener('storage', window._storageEventHandler)

app.use(createPinia())
app.use(router)

app.mount('#app')
