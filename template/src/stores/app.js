import { defineStore } from 'pinia'
import { markRaw } from 'vue'

// Import only the icons we need
import {
  PhCube,
  PhSquaresFour,
  PhPackage,
  PhBookOpen,
  PhSlidersHorizontal,
  PhCalendarDots,
} from '@phosphor-icons/vue'

// Create an icon map for quick lookup
const iconMap = {
  PhCube: PhCube,
  PhSquaresFour: PhSquaresFour,
  PhPackage: PhPackage,
  PhBookOpen: PhBookOpen,
  PhSlidersHorizontal: PhSlidersHorizontal,
  PhCalendarDots: PhCalendarDots,
}

export const useAppStore = defineStore('app', {
  state: () => ({
    selectedApp: null,
    selectedAppTitle: null,
    currentMenu: null,
    apps: [],
    user: null,
    company: {
      name: 'Dealer Management System',
      plan: 'MPM',
    },
  }),

  actions: {
    setSelectedApp(url, title, parentMenu) {
      // Handle URL combination with baseUrl if present
      if (parentMenu?.baseUrl) {
        // Check if the url already includes the baseUrl
        if (!url.startsWith(parentMenu.baseUrl)) {
          this.selectedApp = `${parentMenu.baseUrl}${url}`
        } else {
          this.selectedApp = url
        }
      } else {
        this.selectedApp = url
      }
      this.selectedAppTitle = title
    },
    setCurrentMenu(menu) {
      this.currentMenu = menu
    },
    setUser(userData) {
      this.user = userData
      sessionStorage.setItem('user', JSON.stringify(userData))
    },
    clearSelectedApp() {
      this.selectedApp = null
      this.selectedAppTitle = null
      this.currentMenu = null
    },
    async loadApps() {
      try {
        const response = await fetch('/config/apps.json')
        const config = await response.json()
        // Transform the navigation data with proper icon components
        this.apps = config.navigation.navMain.map((item) => ({
          ...item,
          icon: markRaw(iconMap[item.icon] || PhCube),
          // Transform submenu URLs to include baseUrl
          items: item.items.map(subItem => ({
            ...subItem,
            // Store original URL for reference
            originalUrl: subItem.url,
            // Don't combine URLs here, let setSelectedApp handle it
            url: subItem.url
          }))
        }))

        // Load user data from session storage if available
        const userData = sessionStorage.getItem('user')

        if (userData) {
          this.user = JSON.parse(userData)
        } else if (import.meta.env.DEV) {
          // Set development user data
          this.setUser({
            name: 'kabeng',
            dealercode: '00006'
          })
        }
      } catch (error) {
        console.error('Error loading apps config:', error)
      }
    },
  },
})
