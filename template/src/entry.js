import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia for state management
import config from 'devextreme/core/config' // Import DevExtreme config

import App from './App.vue'
import router from './router'
import i18n from './lib/i18n'

import tailwindCss from './assets/main.css?url'
import dxCss from './assets/dx.material.custom-scheme.css?url'

let app = null
let styleTags = []
let shadowRoot = null
let shadowHost = null

// Apply DevExtreme configuration
config({
  licenseKey: import.meta.env.VITE_LICENSE_KEY_DEVEXTREME, // Use the license key from .env
  defaultCurrency: 'IDR', // Set the default currency
})

const getStoredTheme = () => {
  return localStorage.getItem('theme') || 'mpm' // default theme
}

export const mount = (container) => {
  if (app != null) return

  if (container instanceof HTMLElement) {
    shadowRoot = container.shadowRoot ?? container.attachShadow({ mode: 'open' })
    shadowHost = container
  } else {
    shadowRoot = container
    shadowHost = shadowRoot.host
  }

  window.__shadowRoot = shadowRoot
  shadowHost.setAttribute('data-theme', getStoredTheme());

  [tailwindCss, dxCss].forEach((href) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href

    if(import.meta.env.MODE === 'development') {
      console.log("config", import.meta.url);

      link.href = new URL(href, new URL(import.meta.url).origin).href
    }

    link.crossOrigin = 'anonymous' // matches Vite’s build output
    shadowRoot.appendChild(link)
    styleTags.push(link)
  })

  // --- Mount Vue app into shadow root (wait for CSS to load first) ---
  const mountPoint = document.createElement('div')
  shadowRoot.appendChild(mountPoint)

  app = createApp(App)
  app.use(i18n)
  app.use(createPinia())
  app.use(router)

  // locale sync logic
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

  window._storageEventHandler = function (event) {
    if (event.key === 'locale' && event.newValue) {
      i18n.global.locale.value = event.newValue
    }

    if (event.key === 'theme' && event.newValue && shadowHost) {
      shadowHost.setAttribute('data-theme', event.newValue)
    }
  }
  window.addEventListener('storage', window._storageEventHandler)

  // Wait for appended CSS links to load (but don't block forever).
  const waitForLink = (link) => new Promise((resolve) => {
    // If the stylesheet is already available, resolve immediately
    try {
      if (link.sheet) return resolve()
    } catch (e) {
      // Accessing link.sheet can throw in some browsers for cross-origin; ignore
    }
    const onEnd = () => {
      link.removeEventListener('load', onEnd)
      link.removeEventListener('error', onEnd)
      resolve()
    }
    link.addEventListener('load', onEnd)
    link.addEventListener('error', onEnd)
  })

  const allLinks = styleTags.slice() // snapshot
  const allLoaded = Promise.all(allLinks.map(waitForLink))
  const timeout = new Promise((resolve) => setTimeout(resolve, 3000)) // 3s timeout

  Promise.race([allLoaded, timeout]).then(() => {
    // If app was unmounted while we were waiting, skip mounting
    if (!app) return
    try {
      app.mount(mountPoint)
    } catch (error) {
      console.error('ERROR: entry.ts mount()', error)
    }
  })
}

export const unmount = () => {
  if (app != null) {
    app.unmount()
    app = null
  }

  // Remove CSS links
  styleTags.forEach((tag) => tag.remove())
  styleTags = []

  // Remove event listener
  if (window._storageEventHandler) {
    window.removeEventListener('storage', window._storageEventHandler)
    delete window._storageEventHandler
  }

  // Clear shadow root
  if (shadowRoot) {
    shadowRoot.innerHTML = ''
    shadowRoot = null
  }
}

export const navigate = (path) => {
  if (router) {
    router.push(path).catch(() => {}) // ignore NavigationDuplicated errors
  }
}
