<script lang="ts" setup>
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"
  import type { FormFieldProps, SelectProps } from "@nuxt/ui"

  interface Props extends Omit<CustomFieldProps<string>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    ui?: {
      input?: SelectProps["ui"]
      field?: FormFieldProps["ui"]
    }
    arrow?: SelectProps["arrow"]
    placeholder?: SelectProps["placeholder"]
    items?: SelectProps["items"]
    multiple?: boolean
    valueKey?: string | number
    labelKey?: any
  }

  const { name, label, valueKey = "value", items = [], ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isTouched, ...field } = useCustomField<string>({
    ...props,
    name,
    label: label || "",
  })

  const setValueAndValidate = (payload: any) => {
    field.setValue(payload)
    field.validate()
  }

  const onBlur = () => {
    field.setTouched(true)
  }
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage ? errorMessage : ''"
    :label="label"
    :ui="ui?.field"
    :description="description"
    :hint="hint"
    :help="help"
    :size="size"
    :required="required">
    <USelect
      :arrow="arrow"
      :placeholder="placeholder"
      :ui="ui?.input"
      :items="items"
      :value-key="valueKey"
      :label-key="labelKey"
      :multiple="multiple"
      :model-value="fieldValue"
      @blur="onBlur"
      @update:model-value="setValueAndValidate">
      <template #item-label="{ item }">
        <slot name="input-item-label" :item="item" />
      </template>
    </USelect>
  </UFormField>
</template>
