<script lang="ts" setup>
import { useCustomField, type CustomFieldProps } from '@formwerk/core'
import type { FormFieldProps, InputProps, SelectMenuProps } from '@nuxt/ui'

interface Props extends Omit<CustomFieldProps<string>, 'label'> {
  label?: string
  fieldUi?: FormFieldProps['ui']
  required?: FormFieldProps['required']
  // input
  arrow?: boolean
  searchInput?: boolean | InputProps
  placeholder?: string
  inputUi?: SelectMenuProps['ui']
  items?: SelectMenuProps['items']
  disabled?: boolean
}

const { arrow = true, items, ...props } = defineProps<Props>()

const { fieldValue, ...field } = useCustomField<string>({
  ...props,
  label: props.label || '',
})

const setValueAndValidate = (item: string) => {
  field.setValue(item)
  field.validate()
}
</script>

<template>
  <UFormField :label="label" :error="field.displayError()" :ui="fieldUi">
    <USelectMenu
      :search-input="searchInput"
      :arrow="arrow"
      :ui="inputUi"
      :items="items"
      value-key="value"
      :model-value="fieldValue"
      @update:model-value="setValueAndValidate"
    />
  </UFormField>
</template>
