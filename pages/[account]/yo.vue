<template>
  <div class="relative flex flex-col">
    <div
      class="absolute z-10 w-full h-screen pointer-events-none transition-all lg:w-full"
      :class="{
        'bg-black/30 backdrop-blur-sm': isEditing,
        'bg-black/0': !isEditing,
      }"
    ></div>
    <div class="absolute absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
      <div class="w-full px-2">
        <!-- <button
          type="button"
          class="relative block p-12 mx-auto my-5 text-center border-2 border-gray-300 border-dashed rounded-lg lg:w-1/2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          v-if="data.players.length < 1"
          @click="isEditing = !isEditing"
        >
          <UIcon name="i-fa6-solid-users-viewfinder" class="text-6xl text-gray-400" />
          <span class="block mt-4 text-sm font-medium text-gray-900">Add some players to the league</span>
        </button> -->
        <!-- <TeamGenerated
          :players="activePlayers"
          :team-count="data.config.teamCount"
          @shuffled="onShuffled"
          :snapshot="data.snapshot"
          :rules="data.config.rules"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const isEditing = ref(false)

// useHead({
//   title: () => {
//     return data.value.config?.leagueName || 'Team Generator'
//   },
// })

// watch(data.value, () => {
//   unsavedChanges.value = true
// })

// const removePlayer = (index: number) => {
//   data.value.players.splice(index, 1)
//   data.value.snapshot = {}
// }

// const onShuffled = (snapshot: Snapshot) => {
//   data.value.snapshot = snapshot
// }
</script>
