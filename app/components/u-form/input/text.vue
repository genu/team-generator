<script lang="ts" setup>
import { useCustomField, type CustomFieldProps } from '@formwerk/core'
import type { FormFieldProps, InputProps } from '@nuxt/ui'

interface Props extends Omit<CustomFieldProps<string>, 'label'> {
  label?: string
  size?: FormFieldProps['size']
  placeholder?: string
  required?: boolean
  fieldUi?: FormFieldProps['ui']
  inputUi?: InputProps['ui']
}

const { name, label, placeholder, ...props } = defineProps<Props>()

const slots = defineSlots<{
  trailing(): any
}>()

const { fieldValue, isDisabled, validate, ...field } = useCustomField<string>({
  ...props,
  name,
  label: label || '',
})

const setValueAndValidate = (value: string | number) => {
  field.setValue(`${value}`)
  validate()
}
</script>

<template>
  <UFormField
    :label="label"
    :error="field.displayError()"
    :description="props.description"
    :size="props.size"
    :required="props.required"
    :ui="props.fieldUi"
  >
    <UInput
      :ui="props.inputUi"
      :name="name"
      :disabled="isDisabled"
      :placeholder="placeholder"
      :model-value="fieldValue"
      @update:model-value="setValueAndValidate"
    >
      <template v-if="slots['trailing']" #trailing>
        <slot name="trailing" />
      </template>
    </UInput>
  </UFormField>
</template>
