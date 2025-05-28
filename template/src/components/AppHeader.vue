<script setup>
import { SidebarTrigger } from "./ui/sidebar";
import { useAppStore } from '@/stores/app'
import { computed, onMounted } from 'vue'
import NavUser from "./Sidebar/NavUser.vue";

const appStore = useAppStore()

const currentMenu = computed(() => {
  if (!appStore.selectedApp) return null

  // Find the menu and submenu that contains the selected app
  for (const menu of appStore.apps) {
    const foundSubmenu = menu.items.find(item => item.title === appStore.selectedAppTitle)
    if (foundSubmenu) {
      return {
        menu,
        submenu: foundSubmenu
      }
    }
  }
  return null
})

const user = computed(() => {
  const userData = sessionStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
})

onMounted(() => {
  // Load user data from session storage if not already in store
  if (!appStore.user) {
    const userData = sessionStorage.getItem('user')
    if (userData) {
      appStore.setUser(JSON.parse(userData))
    }
  }
})
</script>

<template>
  <header
    class="bg-base-200 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    <div class="flex items-center justify-between flex-1 gap-2 px-4">
      <div class="flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
        <template v-if="currentMenu">
          <span class="text-gray-500">{{ currentMenu.menu.title }}</span>
          <span class="text-gray-500">/</span>
          <h1 class="text-lg font-semibold">{{ currentMenu.submenu.title }}</h1>
        </template>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="user" class="flex items-center gap-2">
          <NavUser :user="user" />
        </div>
      </div>
    </div>
  </header>
</template>
