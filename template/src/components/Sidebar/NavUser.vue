<script setup>
import { PhSealCheck, PhSignOut } from '@phosphor-icons/vue';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  SidebarMenuButton,
  useSidebar,
} from '../ui/sidebar'
import {
  ChevronsUpDown,
} from 'lucide-vue-next'
import router from '@/router';
import { getInitials } from '@/utils/string'

defineProps({
  user: {
    type: Object,
    required: true,
    validator: (user) => {
      return (
        typeof user.name === 'string' &&
        typeof user.dealercode === 'string' &&
        (user.avatar === undefined || typeof user.avatar === 'string')
      );
    },
  },
});
const { isMobile } = useSidebar()
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-base-100 border border-base-300 w-64">
        <Avatar class="h-8 w-8 rounded-lg">
          <AvatarImage :src="user.avatar ?? ''" :alt="user.name" />
          <AvatarFallback class="rounded-lg">
            {{ getInitials(user.name) }}
          </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ user.name }}</span>
          <span class="truncate text-xs">{{ user.dealercode }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      :side="isMobile ? 'bottom' : 'bottom'" align="end" :side-offset="4">
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="h-8 w-8 rounded-lg">
            <AvatarImage :src="user.avatar ?? ''" :alt="user.name" />
            <AvatarFallback class="rounded-lg">
              {{ getInitials(user.name) }}
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ user.name }}</span>
            <span class="truncate text-xs">{{ user.dealercode }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <PhSealCheck weight="duotone" />
          Account
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="router.push('login')">
        <PhSignOut weight="duotone" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
