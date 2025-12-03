<template>
  <FormwerkGroup name="rules" class="flex flex-col gap-2 p-2">
    <FormwerkField #="{ setValue, value }">
      <UCheckbox :model-value="value" disabled label="Choose goalies first" @update:model-value="setValue" />
    </FormwerkField>
    <FormwerkField #="{ setValue, value }">
      <UCheckbox :model-value="value" disabled label="Choose keepers first" @update:model-value="setValue" />
    </FormwerkField>
    <FormwerkField #="{ setValue, value }">
      <UCheckbox
        :model-value="value"
        disabled
        label="Best goalie cannot be on same team with best player (soon)"
        @update:model-value="setValue" />
    </FormwerkField>
  </FormwerkGroup>
</template>
