<script lang="ts" setup>
  const { colors } = useShirtColors()
</script>

<template>
  <FormwerkGroup name="options" class="flex flex-col gap-2 p-2">
    <FormwerkField
      #="{ value, setValue }"
      name="name"
      label="League Name:"
      size="lg"
      :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }">
      <UInput
        :model-value="value"
        :ui="{ root: 'flex items-center gap-2' }"
        placeholder="League Name"
        @update:model-value="setValue" />
    </FormwerkField>

    <FormwerkField
      #="{ value, setValue }"
      size="lg"
      label="# of Teams:"
      :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }">
      <UInputNumber
        disable-keyboard-input
        :model-value="value"
        :ui="{ root: 'w-28' }"
        :increment="{ color: 'info', variant: 'solid', size: 'sm' }"
        :decrement="{ color: 'info', variant: 'solid', size: 'sm' }"
        @update:model-value="setValue" />
    </FormwerkField>
    <DevOnly>
      <FormwerkField
        #="{ value, setValue }"
        size="lg"
        :ui="{
          root: 'flex items-center gap-2',
          labelWrapper: 'flex justify-end',
          wrapper: 'w-28',
          container: 'flex-1',
        }">
        <UCheckbox
          :model-value="value"
          label="Use Team Colors"
          color="info"
          description="Assign shirt colors for teams"
          @update:model-value="setValue" />
      </FormwerkField>
      <FormwerkField
        #="{ value, setValue }"
        :ui="{
          root: 'flex items-center gap-2',
          labelWrapper: 'flex justify-end',
          wrapper: 'w-28',
          container: 'flex-1',
        }"
        size="lg"
        :items="[]">
        <USelect
          :ui="{ base: 'flex w-full', content: 'w-full' }"
          :items="colors"
          :model-value="value"
          placeholder="Select Team Colors"
          multiple
          value-key="name"
          label-key="name"
          @update:model-value="setValue">
          <template #item-label="{ item }">
            <div
              :style="{ backgroundColor: (item as ShirtColor).background, color: (item as ShirtColor).foreground }"
              class="p-1 rounded-md bg-gray-200">
              {{ (item as ShirtColor).name }}
            </div>
          </template>
        </USelect>
      </FormwerkField>
    </DevOnly>
  </FormwerkGroup>
</template>
