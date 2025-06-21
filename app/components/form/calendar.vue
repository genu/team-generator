<script lang="ts" setup>
  import { type CustomFieldProps, useCustomField } from "@formwerk/core"
  import { parseAbsolute, getLocalTimeZone, type DateValue, DateFormatter } from "@internationalized/date"
  import type { FormFieldProps, CalendarProps, ButtonProps } from "@nuxt/ui"

  interface Props extends Omit<CustomFieldProps<Date>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    color?: CalendarProps["color"]
    button?: Omit<ButtonProps, "size">
    ui?: {
      input?: CalendarProps["ui"]
      field?: FormFieldProps["ui"]
    }
    isDateDisabled?: (date: Date) => boolean
    placeholder?: CalendarProps["placeholder"]
  }

  const { label, name, value = new Date(), ...props } = defineProps<Props>()

  const { fieldValue, ...field } = useCustomField<Date>({
    ...props,
    name,
    label: label || "",
    value,
  })

  const df = new DateFormatter("en-US", {
    dateStyle: "medium",
  })

  const pickerOpen = ref(false)
  const date = computed<DateValue>({
    get: () => {
      if (!fieldValue.value) return parseAbsolute(new Date().toISOString(), getLocalTimeZone())

      return parseAbsolute(fieldValue.value.toISOString(), getLocalTimeZone())
    },
    set(value: DateValue) {
      const newDate = value.toDate(getLocalTimeZone())
      field.setValue(newDate)
      pickerOpen.value = false
    },
  })

  const internalIsDateDisabled = (date: DateValue) => {
    if (props.isDateDisabled) return props.isDateDisabled(date.toDate(getLocalTimeZone()))

    return false
  }
</script>

<template>
  <UPopover v-model:open="pickerOpen" arrow>
    <UButton v-bind="button" icon="i-lucide-calendar" :size="size">
      {{ fieldValue ? df.format(date.toDate(getLocalTimeZone())) : placeholder }}
    </UButton>
    <template #content>
      <UCalendar v-model="date" :size="size" :color="color" :ui="ui?.input" :is-date-disabled="internalIsDateDisabled" />
    </template>
  </UPopover>
</template>
