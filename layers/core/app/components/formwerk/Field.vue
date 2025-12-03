<script setup lang="ts">
  import type { FormFieldProps } from "@nuxt/ui"
  import { useCustomControl } from "@formwerk/core"
  import { formwerkOptionsInjectionKey, formwerkBusInjectionKey, type FormwerkInputEvents } from "./Form.vue"

  const props = defineProps<Omit<FormFieldProps, "validateOnInputDelay" | "errorPattern" | "eagerValidation" | "error">>()

  const formBus = inject(formBusInjectionKey, undefined)
  const formwerkBus = inject(formwerkBusInjectionKey, undefined)
  const formwerkOptions = inject(formwerkOptionsInjectionKey, undefined)

  const {
    field: { errorMessage, fieldValue, setValue, setBlurred, setTouched, isTouched, isBlurred, isDirty },
  } = useCustomControl<any>({ name: props.name, required: props.required, disabled: formwerkOptions?.value?.disabled })

  const emitFormEvent = (type: FormwerkInputEvents, name?: string, payload?: unknown) => {
    if (formwerkBus && name) formwerkBus.emit(type, { name, payload })
  }

  watch(isTouched, (newValue) => emitFormEvent("touched", props.name, newValue))
  watch(isBlurred, (newValue) => emitFormEvent("blur", props.name, newValue))
  watch(isDirty, (newValue) => emitFormEvent("dirty", props.name, newValue))

  const error = computed(() => {
    if (!formwerkOptions || !formwerkOptions.value) return errorMessage.value ? errorMessage.value : undefined

    switch (formwerkOptions.value.validateOn) {
      case "blur":
        return isBlurred.value && errorMessage.value ? errorMessage.value : undefined
      default:
        return errorMessage.value ? errorMessage.value : undefined
    }
  })
  /**
   * Intercept form events
   */

  if (formBus) {
    formBus.on(async (event) => {
      switch (event.type) {
        case "blur":
          setBlurred(true)
          break
        case "change":
        case "input":
        case "focus":
          setTouched(true)
          break
      }
    })
  }
</script>

<template>
  <UFormField v-bind="props" :error="error">
    <slot :set-value="setValue" :value="fieldValue" />
  </UFormField>
</template>
