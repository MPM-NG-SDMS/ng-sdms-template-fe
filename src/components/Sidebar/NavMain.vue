<script setup>
import { PhCaretRight } from '@phosphor-icons/vue';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
    validator: (items) => {
      return items.every((item) => {
        return (
          typeof item.title === 'string' &&
          typeof item.url === 'string' &&
          (item.icon === undefined || typeof item.icon === 'function' || typeof item.icon === 'object') &&
          (item.isActive === undefined || typeof item.isActive === 'boolean') &&
          (item.items === undefined ||
            (Array.isArray(item.items) &&
              item.items.every(
                (subItem) =>
                  typeof subItem.title === 'string' &&
                  typeof subItem.url === 'string'
              )))
        );
      });
    },
  },
});

const handleAppClick = (url, title, parentMenu) => {
  if (url !== '#') {
    appStore.setSelectedApp(url, title, parentMenu)
    appStore.setCurrentMenu(parentMenu)
  }
}
</script>
<template>
  <SidebarGroup>
    <SidebarGroupLabel>SDMS</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible v-for="item in items" :key="item.title" as-child :default-open="item.isActive"
        class="group/collapsible">
        <SidebarMenuItem class="mb-2">
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.title" size="md"
              class="transition-colors duration-200 py-3 shadow-md rounded-md bg-base-100">
              <component :is="item.icon" v-if="item.icon" weight="duotone" size="20" />
              <span>{{ item.title }}</span>
              <PhCaretRight size="16"
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                <SidebarMenuSubButton as-child size="md" @click="handleAppClick(subItem.url, subItem.title, item)">
                  <a :href="subItem.url" @click.prevent>
                    <span>{{ subItem.title }}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
