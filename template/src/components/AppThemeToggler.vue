<script setup>
import { ref, onMounted } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import eventBus from '@/utils/eventBus'
import Button from "./ui/button/Button.vue";

// List of available themes
const themes = [
  'mpm',
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

// Reactive state for the selected theme
const selectedTheme = ref(localStorage.getItem("theme") || "nord");

// Function to change the theme
const changeTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  selectedTheme.value = theme;
  localStorage.setItem("theme", theme); // Save the selected theme in localStorage
  // Emit theme change event
  eventBus.emit('theme-changed', theme);
};

// Set the default theme on mount
onMounted(() => {
  changeTheme(selectedTheme.value);
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" aria-label="Change Theme">
        <div class="bg-base-100 border-base-content/10 grid shrink-0 grid-cols-2 gap-0.5 rounded-md border p-1">
          <div class="bg-base-content size-1 rounded-full"></div>
          <div class="bg-primary size-1 rounded-full"></div>
          <div class="bg-secondary size-1 rounded-full"></div>
          <div class="bg-accent size-1 rounded-full"></div>
        </div>
        <svg width="12px" height="12px" class="mt-px hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56 h-96">
      <ul class="menu">
        <li class="menu-title text-xs">Theme</li>
        <li v-for="theme in themes" :key="theme">
          <DropdownMenuItem asChild>
            <Button variant="ghost" class="gap-3 px-2" @click="changeTheme(theme)">
              <div :data-theme="theme" class="bg-base-100 grid shrink-0 grid-cols-2 gap-0.5 rounded-md p-1 shadow-sm">
                <div class="bg-base-content size-1 rounded-full"></div>
                <div class="bg-primary size-1 rounded-full"></div>
                <div class="bg-secondary size-1 rounded-full"></div>
                <div class="bg-accent size-1 rounded-full"></div>
              </div>
              <div class="w-32 truncate">{{ theme }}</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
                class="invisible h-3 w-3 shrink-0" v-if="selectedTheme === theme">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
              </svg>
            </Button>
          </DropdownMenuItem>
        </li>
      </ul>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
