<script lang="ts" setup>
  import type { FormRepeaterProps } from "@formwerk/core"
  import type { AccordionProps } from "@nuxt/ui"
  import { useFormRepeater } from "@formwerk/core"
  import { SlickItem, SlickList } from "vue-slicksort"

  interface Props extends FormRepeaterProps {
    items?: AccordionProps["items"]
  }
  const props = defineProps<Props>()

  const { items, Iteration, ...repeater } = useFormRepeater(props)

  const onSortEnd = (event: { oldIndex: number; newIndex: number }) => {
    repeater.move(event.oldIndex, event.newIndex)
  }
</script>

<template>
  <div class="flex flex-col w-full gap-2">
    <SlickList
      :list="items"
      axis="y"
      lock-axis="y"
      class="flex flex-col gap-2"
      helper-class="bg-white"
      use-drag-handle
      @sort-end="onSortEnd">
      <Iteration v-for="(key, idx) in items" :key="key" :index="idx">
        <SlickItem :index="idx" :disabled="items.length === 1">
          <slot :items="items" :index="idx" :remove="() => repeater.remove(idx)" :add="() => repeater.add(1)" :repeater="repeater" />
        </SlickItem>
      </Iteration>
    </SlickList>

    <div class="flex justify-end gap-2">
      <USeparator />
      <slot name="footer" :items="items" :repeater="repeater" />
    </div>
  </div>
</template>
