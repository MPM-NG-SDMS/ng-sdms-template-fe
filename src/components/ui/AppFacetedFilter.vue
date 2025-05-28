<script setup>
import { computed} from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { PhCheck, PhPlusCircle } from '@phosphor-icons/vue'
import Badge from './badge/Badge.vue'
import Separator from './separator/Separator.vue'


const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedSet = computed(() => new Set(props.modelValue))

function toggleValue(value) {
  const newSet = new Set(props.modelValue)
  if (newSet.has(value)) {
    newSet.delete(value)
  } else {
    newSet.add(value)
  }
  emit('update:modelValue', Array.from(newSet))
}

function clearFilters() {
  emit('update:modelValue', [])
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-11 border-dashed flex items-center justify-start overflow-hidden">
        <PhPlusCircle class="mr-2 size-6 text-muted-foreground" />
        {{ title }}
        <template v-if="selectedSet.size > 0">
          <Separator orientation="vertical" class="mx-2" />
          <Badge
            variant="secondary"
            class="rounded-sm px-2 lg:hidden"
          >
            {{ selectedSet.size }} selected
          </Badge>
          <div class="hidden space-x-1 lg:flex">
           <Badge
              v-if="selectedSet.size > 2"
              variant="secondary"
              class="rounded-sm px-2"
            >
              {{ selectedSet.size }} selected
            </Badge>
            <template v-else>
              <Badge v-for="(option, index) in options.filter(v => selectedSet.has(v.value))" :key="index"
                variant="secondary"
                class="rounded-sm px-2"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0" align="start">
      <Command>
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="() => toggleValue(option.value)"
              class="transition-colors"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedSet.has(option.value)
                    ? 'bg-primary text-white'
                    : 'opacity-50 [&_svg]:invisible',
                )"
              >
                <PhCheck class="text-primary-foreground size-3" weight="bold" />
              </div>
              <component
                :is="option.icon"
                v-if="option.icon"
                class="mr-2 h-4 w-4 text-muted-foreground"
              />
              <span>{{ option.label }}</span>
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedSet.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                class="justify-center text-center transition-colors"
                value="__clear__"
                @select="clearFilters"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
