<script setup>
import Sidebar from '../ui/sidebar/Sidebar.vue'
import SidebarHeader from '../ui/sidebar/SidebarHeader.vue'
import SidebarContent from '../ui/sidebar/SidebarContent.vue'
import SidebarFooter from '../ui/sidebar/SidebarFooter.vue'
import NavMain from './NavMain.vue'
import NavLogo from './NavLogo.vue'
import ThemeToggler from '../AppThemeToggler.vue'
import { SidebarRail } from '../ui/sidebar'
import IconMPM from '../icons/IconMPM.vue'
import { markRaw, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  collapsible: {
    type: String,
    default: 'icon',
  },
})

const appStore = useAppStore()
const rawLogoIconMPM = markRaw(IconMPM)

onMounted(async () => {
  await appStore.loadApps()
})
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <NavLogo :company="{ ...appStore.company, logo: rawLogoIconMPM }" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="appStore.apps" />
    </SidebarContent>
    <SidebarFooter>
      <div class="flex items-center justify-end">
        <ThemeToggler />
      </div>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
