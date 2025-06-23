<script setup lang="ts">
  import type { InputNumberProps, FormFieldProps } from "@nuxt/ui"
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"

  interface Props extends Omit<CustomFieldProps<number>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    disableKeyboardInput?: boolean
    ui?: {
      input?: InputNumberProps["ui"]
      field?: FormFieldProps["ui"]
    }
    placeholder?: InputNumberProps["placeholder"]
    variant?: InputNumberProps["variant"]
    increment?: InputNumberProps["increment"]
    decrement?: InputNumberProps["decrement"]
  }

  const { name, label, ...props } = defineProps<Props>()
  const inputNumberRef = useTemplateRef("inputNumberRef")

  const { fieldValue, errorMessage, isDisabled, isTouched, ...field } = useCustomField<number>({
    ...props,
    name,
    label: label || "",
  })

  const setValueAndValidate = (value: number) => {
    field.setValue(value)
    field.validate()
  }

  const onBlur = () => {
    field.setTouched(true)
  }

  onMounted(() => {
    if (!inputNumberRef.value || !props.disableKeyboardInput) return

    const input = inputNumberRef.value.$el.querySelector("input")

    if (input) {
      input.setAttribute("readonly", "true")
      input.setAttribute("disabled", "true")
    }
  })
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage ? errorMessage : ''"
    :label="label"
    :description="description"
    :ui="ui?.field"
    :hint="hint"
    :help="help"
    :size="size"
    :required="required">
    <UInputNumber
      ref="inputNumberRef"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :model-value="fieldValue"
      :ui="ui?.input"
      :increment="increment"
      :decrement="decrement"
      @blur="onBlur"
      @update:model-value="setValueAndValidate">
      <template #trailing>
        <slot name="input-trailing" />
      </template>
    </UInputNumber>
  </UFormField>
</template>
