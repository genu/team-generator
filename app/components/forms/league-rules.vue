<template>
  <FormwerkGroup name="rules" class="flex flex-col gap-2 p-2">
    <FormwerkField #="{ model }">
      <UCheckbox v-bind="model" disabled label="Choose goalies first" />
    </FormwerkField>
    <FormwerkField #="{ model }">
      <UCheckbox v-bind="model" disabled label="Choose keepers first" />
    </FormwerkField>
    <FormwerkField #="{ model }">
      <UCheckbox v-bind="model" disabled label="Best goalie cannot be on same team with best player (soon)" />
    </FormwerkField>
  </FormwerkGroup>
</template>
