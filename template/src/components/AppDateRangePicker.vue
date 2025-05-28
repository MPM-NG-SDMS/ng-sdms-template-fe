<script setup>
import { ref, computed } from 'vue';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { parseDate } from '@internationalized/date';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ from: null, to: null })
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const convertJSDateToRekaDate = (jsDate) => {
  if (!jsDate) return null;
  return parseDate(format(jsDate, 'yyyy-MM-dd'));
};

const convertRekaDateToJSDate = (rekaDate) => {
  if (!rekaDate) return null;
  return new Date(rekaDate.year, rekaDate.month - 1, rekaDate.day);
};

const convertedModelValue = computed(() => {
  if (!props.modelValue) return null;
  return {
    start: props.modelValue.from ? convertJSDateToRekaDate(props.modelValue.from) : null,
    end: props.modelValue.to ? convertJSDateToRekaDate(props.modelValue.to) : null
  };
});

const presets = [
  {
    name: "Today",
    getValue: () => {
      const today = new Date();
      return {
        from: today,
        to: today,
      };
    },
  },
  {
    name: "Yesterday",
    getValue: () => {
      const yesterday = addDays(new Date(), -1);
      return {
        from: yesterday,
        to: yesterday,
      };
    },
  },
  {
    name: "Last 7 days",
    getValue: () => {
      return {
        from: addDays(new Date(), -6),
        to: new Date(),
      };
    },
  },
  {
    name: "Last 30 days",
    getValue: () => {
      return {
        from: addDays(new Date(), -29),
        to: new Date(),
      };
    },
  },
  {
    name: "This month",
    getValue: () => {
      const today = new Date();
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      };
    },
  },
  {
    name: "Last month",
    getValue: () => {
      const today = new Date();
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    },
  },
];

const handleDateRangeChange = (range) => {
  emit('update:modelValue', range || { from: null, to: null });
};

const handleClear = (e) => {
  e.stopPropagation();
  handleDateRangeChange(null);
};

const handlePresetSelect = (preset) => {
  handleDateRangeChange(preset.getValue());
  isOpen.value = false;
};

const handleCalendarSelect = (range) => {
  if (range) {
    const convertedRange = {
      from: convertRekaDateToJSDate(range.start),
      to: convertRekaDateToJSDate(range.end)
    };
    handleDateRangeChange(convertedRange);
    // Only close when both dates are selected
    if (convertedRange.from && convertedRange.to) {
      setTimeout(() => isOpen.value = false, 300);
    }
  } else {
    handleDateRangeChange(null);
  }
};
</script>

<template>
  <div class="grid gap-2">
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button
          id="date"
          variant="outline"
          :class="cn('w-full justify-start text-left font-normal', !modelValue?.from && 'text-muted-foreground')"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          <template v-if="modelValue?.from">
            <span class="flex-1">
              <template v-if="modelValue.to">
                {{ format(modelValue.from, 'LLL dd, y') }} - {{ format(modelValue.to, 'LLL dd, y') }}
              </template>
              <template v-else>
                {{ format(modelValue.from, 'LLL dd, y') }}
              </template>
            </span>
            <Button
              variant="ghost"
              size="icon"
              class="h-5 w-5 rounded-full"
              @click="handleClear"
            >
              <X class="h-3 w-3" />
              <span class="sr-only">Clear date range</span>
            </Button>
          </template>
          <template v-else>
            <span>Pick a date range</span>
          </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <div class="flex flex-col sm:flex-row">
          <div class="flex flex-col gap-2 p-3 border-r">
            <Button
              v-for="preset in presets"
              :key="preset.name"
              variant="ghost"
              class="justify-start font-normal"
              @click="handlePresetSelect(preset)"
            >
              {{ preset.name }}
            </Button>
          </div>
          <RangeCalendar
            initial-focus
            :model-value="convertedModelValue"
            @update:model-value="handleCalendarSelect"
            :number-of-months="2"
            class="p-3"
          />
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
