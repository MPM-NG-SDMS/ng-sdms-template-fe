<script setup>
import { Toaster as Sonner } from 'vue-sonner';

const props = defineProps({
  invert: { type: Boolean, required: false },
  theme: { type: String, required: false },
  position: { type: String, required: false },
  hotkey: { type: Array, required: false },
  richColors: { type: Boolean, required: false },
  expand: { type: Boolean, required: false },
  duration: { type: Number, required: false },
  gap: { type: Number, required: false },
  visibleToasts: { type: Number, required: false },
  closeButton: { type: Boolean, required: false },
  toastOptions: { type: Object, required: false },
  class: { type: String, required: false },
  style: { type: Object, required: false },
  offset: { type: [String, Number], required: false },
  dir: { type: String, required: false },
  icons: { type: Object, required: false },
  containerAriaLabel: { type: String, required: false },
  pauseWhenPageIsHidden: { type: Boolean, required: false },
  cn: { type: Function, required: false },
  // Teleport target for Shadow DOM compatibility
  teleportTo: { type: [String, Object], required: false },
});
</script>

<template>
  <teleport :to="props.teleportTo || 'body'">
    <Sonner
      class="toaster group"
      v-bind="props"
      :style="{
        '--normal-bg': 'var(--popover)',
        '--normal-text': 'var(--popover-foreground)',
        '--normal-border': 'var(--border)',
      }"
    />
  </teleport>
</template>
