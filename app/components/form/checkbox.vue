<script lang="ts" setup>
  import type { CheckboxProps, FormFieldProps } from "@nuxt/ui"
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"

  interface Props extends Omit<CustomFieldProps<boolean | "indeterminate">, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    ui?: {
      field?: FormFieldProps["ui"]
      input?: CheckboxProps["ui"]
    }
    color?: CheckboxProps["color"]
  }

  const { name, label, value = undefined, modelValue = undefined, ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isDisabled, isTouched, ...field } = useCustomField<boolean | "indeterminate">({
    ...props,
    name,
    label: label || "",
    value,
    modelValue,
  })

  const setValueAndValidate = (value: boolean | "indeterminate") => {
    field.setValue(value)
    field.validate()
    field.setTouched(true)
  }
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage ? errorMessage : ''"
    :hint="hint"
    :help="help"
    :size="size"
    :ui="ui?.field"
    :required="required">
    <UCheckbox
      :color="color"
      :model-value="fieldValue"
      :label="label"
      :description="description"
      :disabled="isDisabled"
      :ui="ui?.input"
      @update:model-value="setValueAndValidate" />
  </UFormField>
</template>
