<script lang="ts" setup>
  import { useFormGroup, type FormGroupProps } from "@formwerk/core"

  const props = defineProps<FormGroupProps>()

  useFormGroup(props)
</script>

<template>
  <div>
    <slot />
  </div>
</template>
