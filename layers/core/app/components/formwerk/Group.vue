<script lang="ts" setup>
  import { useFormGroup } from "@formwerk/core"

  interface Props {
    name: string
  }

  defineProps<Props>()

  useFormGroup({
    name: "options",
  })
</script>

<template>
  <div>
    <slot />
  </div>
</template>
