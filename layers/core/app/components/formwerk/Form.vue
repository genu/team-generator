<script lang="ts">
  import type { UseEventBusReturn } from "@vueuse/core"
  import { useFormContext } from "@formwerk/core"

  export interface FormInjectedOptions {
    disabled?: boolean
    validateOn?: FormwerkInputEvents
  }

  export type FormwerkInputEvent = {
    name: string
    payload: unknown
  }

  export type FormwerkInputEvents = "touched" | "blur" | "dirty"

  export const formwerkOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>> = Symbol("nuxt-ui-formwerk.form-options")
  export const formwerkBusInjectionKey: InjectionKey<UseEventBusReturn<FormwerkInputEvents, FormwerkInputEvent>> =
    Symbol("nuxt-ui-formwerk.form-events")
</script>

<script lang="ts" setup>
  const { context } = useFormContext()

  interface Props {
    validateOn?: FormwerkInputEvents
    disabled?: boolean
  }

  const { validateOn = "blur", disabled = false } = defineProps<Props>()
  const formwerkBus = useEventBus<FormwerkInputEvents, FormwerkInputEvent>(`formwerk-form-${context.id}`)
  const NuxtUiFormBus = useEventBus<any>(`form-${context.id}`)

  const dirtyFields: Set<any> = reactive(new Set<any>())
  const touchedFields: Set<any> = reactive(new Set<any>())
  const blurredFields: Set<any> = reactive(new Set<any>())

  /**
   * Providers
   */
  provide(formwerkBusInjectionKey, formwerkBus)
  provide(formBusInjectionKey, NuxtUiFormBus)
  provide(
    formwerkOptionsInjectionKey,
    computed(() => ({
      validateOn: validateOn,
    })),
  )
  provide(
    formOptionsInjectionKey,
    computed(() => ({
      disabled,
    })),
  )

  /**
   * Event Handlers
   */
  const toggleState = (set: Set<any>, payload?: FormwerkInputEvent) => {
    if (!payload) return

    const { name, payload: isSet } = payload

    if (isSet) {
      set.add(name)
    } else {
      set.delete(name)
    }
  }

  formwerkBus.on(async (event, payload) => {
    switch (event) {
      case "touched":
        toggleState(touchedFields, payload)
        break
      case "blur":
        toggleState(blurredFields, payload)
        break
      case "dirty":
        toggleState(dirtyFields, payload)
        break
    }
  })
</script>

<template>
  <div>
    <slot :blurred-fields="blurredFields" :touched-fields="touchedFields" :dirty-fields="dirtyFields" />
  </div>
</template>
