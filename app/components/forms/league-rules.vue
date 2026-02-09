<template>
  <UFormGroup name="rules" class="flex flex-col gap-2 p-2">
    <UFormField #="{ model }">
      <UCheckbox v-bind="model" disabled label="Choose goalies first" />
    </UFormField>
    <UFormField #="{ model }">
      <UCheckbox v-bind="model" disabled label="Choose keepers first" />
    </UFormField>
    <UFormField #="{ model }">
      <UCheckbox v-bind="model" disabled label="Best goalie cannot be on same team with best player (soon)" />
    </UFormField>
  </UFormGroup>
</template>
