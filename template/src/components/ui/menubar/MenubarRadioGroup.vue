<script setup>
import { MenubarRadioGroup, useForwardPropsEmits } from "reka-ui";

const props = defineProps({
  modelValue: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: [String, Object, Function], required: false },
});
const emits = defineEmits(["update:modelValue"]);

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <MenubarRadioGroup data-slot="menubar-radio-group" v-bind="forwarded">
    <slot />
  </MenubarRadioGroup>
</template>
