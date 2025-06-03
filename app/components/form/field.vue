<script setup lang="ts">
  import type { FormFieldProps, FormFieldSlots } from "@nuxt/ui"
  import { useCustomField, type CustomFieldProps, type ExposedField } from "@formwerk/core"

  interface Props
    extends Omit<CustomFieldProps<any>, "label">,
      /* @vue-ignore */ Omit<FormFieldProps, "error" | "errorPattern" | "eagerValidation" | "validateOnInputDelay"> {
    label?: string
  }

  interface Slots extends Omit<FormFieldSlots, "default"> {
    default(props: { value: Ref<any>; field?: ExposedField<any> }): any
  }

  const props = defineProps<Props>()
  defineSlots<Slots>()

  const { fieldValue, ...field } = useCustomField<any>({
    ...props,
    name: props.name,
    label: props.label || "",
  })
</script>

<template>
  <UFormField v-bind="$props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="$slots.error" #error>
      <slot name="error" />
    </template>
    <template v-if="$slots.hint" #hint>
      <slot name="hint" />
    </template>
    <template v-if="$slots.help" #help>
      <slot name="help" />
    </template>
    <slot :value="fieldValue" v-bind="field" />
  </UFormField>
</template>
