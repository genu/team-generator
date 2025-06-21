<script setup lang="ts">
  import type { InputProps, FormFieldProps } from "@nuxt/ui"
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"

  interface Props extends Omit<CustomFieldProps<string>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    showError?: boolean
    ui?: {
      input?: InputProps["ui"]
      field?: FormFieldProps["ui"]
    }
    placeholder?: InputProps["placeholder"]
    variant?: InputProps["variant"]
  }

  const { name, label, showError = true, ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isDisabled, isTouched, ...field } = useCustomField<string | number>({
    ...props,
    name,
    label: label || "",
  })

  const setValueAndValidate = (value: string | number) => {
    field.setValue(value)
    field.validate()
  }

  const onBlur = () => {
    field.setTouched(true)
  }
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage && showError ? errorMessage : ''"
    :label="label"
    :description="description"
    :ui="ui?.field"
    :hint="hint"
    :help="help"
    :size="size"
    :required="required">
    <UInput
      :placeholder="placeholder"
      :disabled="isDisabled"
      :model-value="fieldValue"
      :ui="ui?.input"
      @blur="onBlur"
      @update:model-value="setValueAndValidate">
      <template #trailing>
        <slot name="input-trailing" />
      </template>
    </UInput>
  </UFormField>
</template>
