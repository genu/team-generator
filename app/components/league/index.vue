<script lang="ts" setup>
  import type { LeagueConfiguration } from "#generated/zenstack/models"
  import { useBrowserLocation } from "@vueuse/core"
  import { DialogShareLeague } from "#components"
  import { SnapshotDataSchema, type Snapshot, type SnapshotPlayer } from "#shared/schemas"

  const { players, snapshots, leagueConfiguration, leagueId } = defineProps<{
    leagueId: number
    leagueConfiguration: LeagueConfiguration
    players: SnapshotPlayer[]
    snapshots: Snapshot[]
  }>()

  const latestUnsavedSnapshot = defineModel<Snapshot | undefined>("latestUnsavedSnapshot")

  const emit = defineEmits<{
    updateTeamColors: [ShirtColorEnum[]]
  }>()

  const location = useBrowserLocation()
  const overlay = useOverlay()
  const client = useClientQueries()

  const { mutateAsync: createSnapshotAsync } = client.snapshot.useCreate()

  const shareLeagueDialog = overlay.create(DialogShareLeague)

  const snapshot = computed(() => {
    const latestSavedSnapshot = snapshots[0]

    let snapshotToUse: Snapshot = { data: {} }

    if (latestUnsavedSnapshot.value) {
      snapshotToUse = latestUnsavedSnapshot.value
    } else if (latestSavedSnapshot) {
      snapshotToUse = latestSavedSnapshot
    }

    return SnapshotDataSchema.parse(snapshotToUse.data)
  })

  const { shuffle, teams, isShuffled, movePlayer, addPlayerToTeam, removePlayerFromTeam } = useTeamShuffle(
    snapshot,
    latestUnsavedSnapshot,
  )

  const configuration = computed(() => leagueConfiguration)

  const teamColorOverrides = ref<ShirtColorEnum[]>()

  const teamColors = computed(() => {
    if (teamColorOverrides.value) return teamColorOverrides.value
    const cfg = leagueConfiguration as Record<string, unknown>
    return [...((cfg.teamColorAssignments as ShirtColorEnum[]) ?? leagueConfiguration.teamColors ?? [])] as ShirtColorEnum[]
  })

  // Only reset overrides when the available colors actually change (e.g., user edited league options)
  watch(
    () => JSON.stringify(leagueConfiguration.teamColors),
    () => {
      teamColorOverrides.value = undefined
    },
  )

  const changeTeamColor = (teamNumber: number, color: ShirtColorEnum) => {
    const updated = [...teamColors.value]
    updated[teamNumber] = color
    teamColorOverrides.value = updated
    emit("updateTeamColors", updated)
  }

  const toggleBookmark = async () => {
    await createSnapshotAsync({
      data: {
        data: {},
        leagueId,
      },
    })
  }

  const onShuffleTeams = () => {
    shuffle(players, configuration.value)
  }
</script>

<template>
  <div class="flex flex-col gap-2 lg:gap-2">
    <div v-if="players.length > 0" class="flex justify-between gap-4">
      <div>
        <DevOnly>
          <UButton variant="ghost" icon="i-lucide-star" label="Bookmark" @click="toggleBookmark" />
        </DevOnly>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          icon="i-lucide-share-2"
          label="Share"
          variant="ghost"
          @click="shareLeagueDialog.open({ shareUrl: location.href! })" />
        <UButton @click="onShuffleTeams">Shuffle Teams</UButton>
      </div>
    </div>
    <div class="flex justify-end">
      <div v-if="players.length > 0 && !isShuffled" class="flex flex-col items-center mt-2 mr-3">
        <UIcon name="i-lucide-arrow-up" class="text-4xl text-gray-400 animate-bounce" style="--fa-bounce-jump-scale-y: 1" />
        <span class="block text-sm font-medium text-gray-900">Click to shuffle</span>
      </div>
    </div>

    <div class="items-start mt-2 gap-3 md:gap-3 grid grid-cols-2 lg:grid-cols-3">
      <Team
        v-for="(snapshotPlayers, idx) in teams"
        :key="idx"
        data-testid="league-team"
        :team-name="`Team ${parseInt(idx as unknown as string) + 1}`"
        :team-number="parseInt(idx as unknown as string)"
        :team-color="configuration.useTeamColors ? teamColors[parseInt(idx as unknown as string)] : undefined"
        :available-colors="configuration.useTeamColors ? (configuration.teamColors as ShirtColorEnum[]) : undefined"
        :players="snapshotPlayers"
        @move-player="movePlayer"
        @add-player="addPlayerToTeam"
        @remove-player="removePlayerFromTeam"
        @change-color="changeTeamColor" />
    </div>
  </div>
</template>
