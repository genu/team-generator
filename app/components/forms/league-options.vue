<script lang="ts" setup>
  const { colors } = useShirtColors()
</script>

<template>
  <UFormGroup name="options" class="flex flex-col gap-2 p-2">
    <UFormField
      #="{ model }"
      name="name"
      label="League Name:"
      size="lg"
      :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }">
      <UInput v-bind="model" :ui="{ root: 'flex items-center gap-2' }" placeholder="League Name" />
    </UFormField>

    <UFormField
      #="{ model }"
      size="lg"
      label="# of Teams:"
      name="teamCount"
      :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }">
      <UInputNumber
        v-bind="model"
        disable-keyboard-input
        :ui="{ root: 'w-28' }"
        :increment="{ color: 'info', variant: 'solid', size: 'sm' }"
        :decrement="{ color: 'info', variant: 'solid', size: 'sm' }" />
    </UFormField>
    <UFormField
      #="{ model }"
      size="lg"
      :ui="{
        root: 'flex items-center gap-2',
        labelWrapper: 'flex justify-end',
        wrapper: 'w-28',
        container: 'flex-1',
      }">
      <UCheckbox v-bind="model" label="Use Team Colors" color="info" description="Assign shirt colors for teams" />
    </UFormField>
    <UFormField
      #="{ model }"
      :ui="{
        root: 'flex items-center gap-2',
        labelWrapper: 'flex justify-end',
        wrapper: 'w-28',
        container: 'flex-1',
      }"
      size="lg"
      :items="[]">
      <USelect
        v-bind="model"
        :ui="{ base: 'flex w-full', content: 'w-full' }"
        :items="colors"
        placeholder="Select Team Colors"
        multiple
        value-key="name"
        label-key="name">
        <template #item-label="{ item }">
          <div :style="{ backgroundColor: item.background, color: item.foreground }" class="p-1 rounded-md bg-gray-200">
            {{ item.name }}
          </div>
        </template>
      </USelect>
    </UFormField>
  </UFormGroup>
</template>
