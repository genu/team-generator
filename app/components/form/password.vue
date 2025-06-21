<script lang="ts" setup>
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"
  import type { FormFieldProps, InputProps } from "@nuxt/ui"

  interface Props extends Omit<CustomFieldProps<string>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    placeholder?: InputProps["placeholder"]
    required?: FormFieldProps["required"]
    passwordToggle?: boolean
    ui?: {
      input?: InputProps["ui"]
      field?: FormFieldProps["ui"]
    }
    variant?: InputProps["variant"]
  }

  const { name, label, ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isTouched, isDisabled, ...field } = useCustomField<string>({
    ...props,
    name,
    label: label || "",
  })

  const passwordVisibility = ref(false)

  const togglePasswordVisibility = () => {
    passwordVisibility.value = !passwordVisibility.value
  }

  const setValueAndValidate = (value: string | number) => {
    field.setValue(`${value}`)
    field.validate()
  }
</script>

<template>
  <UFormField
    :label="label"
    :error="field.displayError()"
    :description="description"
    :ui="ui?.field"
    :size="size"
    :required="required">
    <UInput
      :error="isTouched && errorMessage ? errorMessage : ''"
      :disabled="isDisabled"
      :model-value="fieldValue"
      :placeholder="placeholder"
      :type="passwordVisibility ? 'text' : 'password'"
      :ui="ui?.input"
      @blur="field.setTouched(true)"
      @update:model-value="setValueAndValidate">
      <template v-if="passwordToggle" #trailing>
        <UButton
          :padded="false"
          :disabled="isDisabled"
          color="neutral"
          variant="link"
          :ui="{ base: 'cursor-pointer' }"
          :icon="passwordVisibility ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
          @click="togglePasswordVisibility" />
      </template>
    </UInput>
  </UFormField>
</template>
