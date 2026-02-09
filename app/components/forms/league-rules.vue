<template>
  <UFormGroup name="rules" class="flex flex-col gap-2 p-2">
    <UFormField name="goaliesFirst" #="{ model }">
      <UCheckbox v-bind="model" label="Choose goalies first" />
    </UFormField>
    <UFormField name="keepGoalies" #="{ model }">
      <UCheckbox v-bind="model" disabled label="Keep goalies between shuffles (coming soon)" />
    </UFormField>
    <UFormField name="noBestGoalieAndPlayer" #="{ model }">
      <UCheckbox v-bind="model" disabled label="Best goalie cannot be on same team as best player (coming soon)" />
    </UFormField>
  </UFormGroup>
</template>
