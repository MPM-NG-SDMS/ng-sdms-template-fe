<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted } from 'vue'
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

const currentTheme = ref('light')
const messages = ref([])

// Function to add message
const addMessage = (message) => {
  messages.value.unshift(message)
  if (messages.value.length > 10) {
    messages.value.pop()
  }
}

// Handle theme updates from parent
const handleThemeUpdate = (event) => {
  if (event.data.type === 'THEME_UPDATE') {
    currentTheme.value = event.data.theme
    document.documentElement.setAttribute('data-theme', event.data.theme)
    addMessage(`Theme changed to: ${event.data.theme}`)
  }
}

// Check URL parameters for initial theme
const checkUrlTheme = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const theme = urlParams.get('theme')
  if (theme) {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    addMessage(`Initial theme from URL: ${theme}`)
  }
}

onMounted(() => {
  // Add message listener
  window.addEventListener('message', handleThemeUpdate)
  // Check URL parameters
  checkUrlTheme()
  // Add initial message
  addMessage('Application loaded')
})
</script>

<template>
  <TooltipProvider>
    <div class="flex flex-1 flex-col gap-4 bg-base-200 min-h-svh px-4 py-6">
      <Toaster richColors position="top-right"/>
      <RouterView />
    </div>
  </TooltipProvider>
</template>
