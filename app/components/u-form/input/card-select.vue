<script lang="ts" setup generic="Option">
import type { AcceptableValue } from 'reka-ui'
import { useCustomField, type CustomFieldProps } from '@formwerk/core'
import type { FormFieldProps } from '@nuxt/ui'
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui'

interface Props extends Omit<CustomFieldProps<Option>, 'label'> {
  label?: string
  multiple?: boolean
  orientation?: 'horizontal' | 'vertical'
  valueKey?: string
  inputUi?: {
    base?: string
    toggleGroup?: string
    toggleGroupItem?: string
  }
  size?: FormFieldProps['size']
  fieldUi?: FormFieldProps['ui']
  items?: Option[]
}

const { name, label, valueKey = 'value', inputUi, items, ...props } = defineProps<Props>()

const { fieldValue, ...field } = useCustomField<AcceptableValue | AcceptableValue[]>({
  name,
  label: label || '',
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
  <UFormField :ui="props.fieldUi" :label="label" :size="props.size" :error="field.displayError()" :description="props.description">
    <ToggleGroupRoot
      :model-value="fieldValue"
      :class="['flex gap-4', inputUi?.toggleGroup, { 'flex-col': orientation === 'vertical' }]"
      :type="multiple ? 'multiple' : 'single'"
      @update:model-value="onModelUpdate"
    >
      <ToggleGroupItem
        v-for="(option, idx) in items"
        :key="idx"
        :class="inputUi?.toggleGroupItem"
        :value="(option as any)[valueKey]"
        #="{ state }"
      >
        <slot name="option" :option="option" :is-checked="state === 'on'" />
      </ToggleGroupItem>
      <slot name="empty-option" />
    </ToggleGroupRoot>
  </UFormField>
</template>
