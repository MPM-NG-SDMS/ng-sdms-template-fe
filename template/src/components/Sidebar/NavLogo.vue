<script setup>
import router from '@/router';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar'
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const props = defineProps({
  company: {
    type: Object,
    required: true,
    default: () => { },
    validator: (company) => {
      return (
        typeof company.name === 'string' &&
        typeof company.plan === 'string' &&
        (typeof company.logo === 'function' || typeof company.logo === 'object')
      );
    },
  },
});

const activeTeam = ref(props.company)

</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent focus:bg-transparent active:bg-transparent mt-4">
        <div class="flex flex-1 items-center justify-center gap-2" @click="appStore.clearSelectedApp()">
          <component :is="activeTeam.logo" class="w-24" />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
