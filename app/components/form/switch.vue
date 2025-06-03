<script lang="ts" setup>
  import type { SwitchProps, FormFieldProps } from "@nuxt/ui"
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"

  interface Props extends Omit<CustomFieldProps<boolean>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    ui?: {
      field?: FormFieldProps["ui"]
      input?: SwitchProps["ui"]
    }
    color?: SwitchProps["color"]
    loading?: SwitchProps["loading"]
    switchLabel?: SwitchProps["label"]
    switchDescription?: SwitchProps["description"]
  }

  const { name, label, ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isDisabled, isTouched, ...field } = useCustomField<boolean>({
    ...props,
    name,
    label: label || "",
  })

  const setValueAndValidate = (value: boolean) => {
    field.setValue(value)
    field.validate()
    field.setTouched(true)
  }
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage ? errorMessage : ''"
    :label="label"
    :description="description"
    :hint="hint"
    :help="help"
    :size="size"
    :ui="ui?.field"
    :required="required">
    <USwitch
      :color="color"
      :model-value="fieldValue"
      :disabled="isDisabled"
      :ui="ui?.input"
      :loading="loading"
      :label="switchLabel"
      :description="switchDescription"
      @update:model-value="setValueAndValidate" />
  </UFormField>
</template>
