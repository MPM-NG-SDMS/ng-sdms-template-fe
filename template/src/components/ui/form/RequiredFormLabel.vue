<script setup>
import FormLabel from './FormLabel.vue';

defineProps({
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <FormLabel>
    <slot />
    <span v-if="required" class="text-destructive ml-1">*</span>
  </FormLabel>
</template>
