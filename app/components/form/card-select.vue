<script lang="ts" setup generic="Option">
  import type { AcceptableValue } from "reka-ui"
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"
  import type { FormFieldProps } from "@nuxt/ui"
  import { ToggleGroupRoot, ToggleGroupItem } from "reka-ui"

  interface Props extends Omit<CustomFieldProps<AcceptableValue | AcceptableValue[]>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    ui?: {
      field?: FormFieldProps["ui"]
      input?: {
        base?: string
        toggleGroup?: string
        toggleGroupItem?: string
      }
    }
    multiple?: boolean
    orientation?: "horizontal" | "vertical"
    valueKey?: string
    items?: Option[]
  }

  const { name, label, valueKey = "value", ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isTouched, ...field } = useCustomField<AcceptableValue | AcceptableValue[]>({
    ...props,
    name,
    label: label || "",
  })

  const onModelUpdate = (e: AcceptableValue | AcceptableValue[]) => {
    const values = Array.isArray(e) ? e : [e]

    if (props.multiple) {
      field.setValue(values)
    } else {
      field.setValue(values[0])
    }
  }
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage ? errorMessage : ''"
    :label="label"
    :description="props.description"
    :ui="ui?.field"
    :size="props.size"
    :hint="hint"
    :help="help"
    :required="required">
    <ToggleGroupRoot
      :model-value="fieldValue"
      :class="['flex gap-4', ui?.input?.toggleGroup, { 'flex-col': orientation === 'vertical' }]"
      :type="multiple ? 'multiple' : 'single'"
      @update:model-value="onModelUpdate">
      <ToggleGroupItem
        v-for="(option, idx) in items"
        :key="idx"
        :class="ui?.input?.toggleGroupItem"
        :value="(option as any)[valueKey]"
        #="{ state }">
        <slot name="option" :option="option" :is-checked="state === 'on'" />
      </ToggleGroupItem>
      <slot name="empty-option" />
    </ToggleGroupRoot>
  </UFormField>
</template>
