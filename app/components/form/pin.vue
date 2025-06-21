<script lang="ts" setup>
  import type { PinInputProps, FormFieldProps } from "@nuxt/ui"
  import { useCustomField, type CustomFieldProps } from "@formwerk/core"

  interface Props extends Omit<CustomFieldProps<string>, "label"> {
    label?: string
    help?: string
    hint?: string
    size?: FormFieldProps["size"]
    required?: FormFieldProps["required"]
    ui?: {
      input?: PinInputProps["ui"]
      field?: FormFieldProps["ui"]
    }
    placeholder?: PinInputProps["placeholder"]
    variant?: PinInputProps["variant"]
    color?: PinInputProps["color"]
    type?: PinInputProps["type"]
    mask?: PinInputProps["mask"]
    otp?: PinInputProps["otp"]
    highlight?: PinInputProps["highlight"]
    length?: PinInputProps["length"]
    autofocus?: PinInputProps["autofocus"]
    autofocusDelay?: PinInputProps["autofocusDelay"]
  }

  const { name, label, ...props } = defineProps<Props>()

  const { fieldValue, errorMessage, isDisabled, isTouched, ...field } = useCustomField<string>({
    ...props,
    name,
    label: label || "",
  })

  const setValueAndValidate = (value: string[]) => {
    field.setValue(value.join(""))

    // only validate if the value is 5 characters long
    if (value.length === props.length) {
      field.validate()
    }
  }

  const onBlur = () => {
    field.setTouched(true)
  }

  const fieldValueArrayAsString = computed(() => {
    return fieldValue.value?.split("")
  })
</script>

<template>
  <UFormField
    :error="isTouched && errorMessage ? errorMessage : ''"
    :label="label"
    :description="description"
    :hint="hint"
    :help="help"
    :size="size"
    :required="required">
    <UPinInput
      :color="color"
      :type="type"
      :mask="mask"
      :otp="otp"
      :highlight="highlight"
      :disabled="isDisabled"
      :autofocus-delay="autofocusDelay"
      :placeholder="placeholder"
      :length="length"
      :variant="variant"
      :autofocus="autofocus"
      :ui="ui?.input"
      :model-value="fieldValueArrayAsString"
      @blur="onBlur"
      @update:model-value="setValueAndValidate" />
  </UFormField>
</template>
