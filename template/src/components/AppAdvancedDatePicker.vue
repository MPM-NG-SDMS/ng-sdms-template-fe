<script setup>
import { getLocalTimeZone, today } from '@internationalized/date'
import { CalendarRoot, useForwardPropsEmits } from 'reka-ui'
import { createYear, toDate } from 'reka-ui/date'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
} from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// define component props
const props = defineProps({
  modelValue: { default: undefined },
  placeholder: { type: Object, default: () => today(getLocalTimeZone()) },
  weekdayFormat: { type: String, default: 'short' },
  class: { type: [String, Object, Array], default: '' },
  // minimum year to show in the year dropdown
  minYear: { type: Number, default: null },
})

// emit update for v-model
const emit = defineEmits(['update:modelValue'])

// forwarded props for CalendarRoot
const delegatedProps = computed(() => {
  // exclude class, modelValue, and placeholder to avoid double-binding
  // eslint-disable-next-line no-unused-vars
  const { class: _c, modelValue: _mv, placeholder: _ph, minYear: _min, ...delegated } = props
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emit)

// local placeholder controls visible month/year
const placeholder = ref(props.modelValue ?? props.placeholder)

// selected value managed separately from placeholder
const internalValue = ref(props.modelValue)

// helper to stringify calendar dates safely
const toKey = (v) => {
  try {
    return v && typeof v.toString === 'function' ? v.toString() : (v ?? '')
  } catch {
    return ''
  }
}

// keep internal value in sync with external modelValue
watch(
  () => props.modelValue,
  (val) => {
    if (toKey(val) !== toKey(internalValue.value)) {
      internalValue.value = val
    }
    // also align placeholder to selected value if provided
    if (val && toKey(val) !== toKey(placeholder.value)) {
      placeholder.value = val
    }
  },
)

// emit when user selects a new date (value), not when navigating (placeholder)
watch(internalValue, (val) => {
  if (toKey(val) !== toKey(props.modelValue)) {
    emit('update:modelValue', val)
  }
})

// clamp placeholder.year to minYear if provided
watch(
  [placeholder, () => props.minYear],
  ([ph, min]) => {
    if (!ph || min == null) return
    if (ph.year < min) {
      placeholder.value = ph.set({ year: min })
    }
  },
  { immediate: true },
)

// compute year options based on minYear or a decade window around placeholder
const yearOptions = computed(() => {
  const phYear = (placeholder.value && placeholder.value.year) || today(getLocalTimeZone()).year
  if (props.minYear != null) {
    const todayYear = today(getLocalTimeZone()).year
    const maxYear = Math.max(phYear + 10, todayYear + 10)
    const start = props.minYear
    const end = Math.max(start, maxYear)
    const years = []
    for (let y = start; y <= end; y++) years.push(y)
    return years
  }
  const start = phYear - 10
  const end = phYear + 10
  const years = []
  for (let y = start; y <= end; y++) years.push(y)
  return years
})

// i18n-aware month formatter
const { locale } = useI18n()
const monthFormatter = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'long' }))
const monthLabel = (dateObj) => monthFormatter.value.format(dateObj)
</script>

<template>
  <CalendarRoot
    v-slot="{ date, grid, weekDays }"
    v-model="internalValue"
    v-model:placeholder="placeholder"
    v-bind="forwarded"
    :class="cn('rounded-md border p-3', props.class)"
  >
    <CalendarHeader>
      <CalendarHeading class="flex w-full items-center justify-between gap-2">
        <Select
          :default-value="placeholder.month.toString()"
          @update:model-value="
            (v) => {
              if (!v || !placeholder) return
              if (Number(v) === placeholder?.month) return
              placeholder = placeholder.set({
                month: Number(v),
              })
            }
          "
        >
          <SelectTrigger aria-label="Select month" class="w-[60%]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem
              v-for="month in createYear({ dateObj: date })"
              :key="month.toString()"
              :value="month.month.toString()"
            >
              {{ monthLabel(toDate(month)) }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          :default-value="placeholder.year.toString()"
          @update:model-value="
            (v) => {
              if (!v || !placeholder) return
              if (Number(v) === placeholder?.year) return
              placeholder = placeholder.set({
                year: Number(v),
              })
            }
          "
        >
          <SelectTrigger aria-label="Select year" class="w-[40%]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent class="max-h-[200px]">
            <SelectItem v-for="y in yearOptions" :key="y" :value="y.toString()">
              {{ y }}
            </SelectItem>
          </SelectContent>
        </Select>
      </CalendarHeading>
    </CalendarHeader>

    <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody class="grid">
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="mt-2 w-full"
          >
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
