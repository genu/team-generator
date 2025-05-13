<script lang="ts" setup>
import { useCustomField, type CustomFieldProps } from '@formwerk/core'
import type { FormFieldProps, InputProps } from '@nuxt/ui'

interface Props extends Omit<CustomFieldProps<string>, 'label'> {
  label?: string
  size?: FormFieldProps['size']
  placeholder?: string
  required?: boolean
  passwordToggle?: boolean
  fieldUi?: FormFieldProps['ui']
  inputUi?: InputProps['ui']
}

const { name, label, placeholder, ...props } = defineProps<Props>()
const slots = defineSlots<{
  hint(): any
}>()

const { fieldValue, isDisabled, ...field } = useCustomField<string>({
  ...props,
  name,
  label: label || '',
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
    :description="props.description"
    :ui="fieldUi"
    :size="props.size"
    :required="props.required"
  >
    <template v-if="slots['hint']" #hint>
      <slot name="hint" />
    </template>
    <UInput
      :disabled="isDisabled"
      :model-value="fieldValue"
      :placeholder="placeholder"
      :type="passwordVisibility ? 'text' : 'password'"
      :ui="inputUi"
      @blur="field.setTouched(true)"
      @update:model-value="setValueAndValidate"
    >
      <template v-if="passwordToggle" #trailing>
        <UButton
          :padded="false"
          :disabled="isDisabled"
          color="neutral"
          variant="link"
          :ui="{ base: 'cursor-pointer' }"
          :icon="passwordVisibility ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
          @click="togglePasswordVisibility"
        />
      </template>
    </UInput>
  </UFormField>
</template>
