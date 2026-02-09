<script lang="ts" setup>
  import type { LeagueConfiguration } from "#generated/zenstack/models"
  import { useBrowserLocation } from "@vueuse/core"
  import { DialogShareLeague } from "#components"
  import { SnapshotDataSchema, type Snapshot, type SnapshotPlayer } from "#shared/schemas"

  const { players, snapshots, leagueConfiguration, leagueId, teamColors } = defineProps<{
    leagueId: number
    leagueConfiguration: LeagueConfiguration
    players: SnapshotPlayer[]
    snapshots: Snapshot[]
    teamColors: ShirtColorEnum[]
  }>()

  const latestUnsavedSnapshot = defineModel<Snapshot | undefined>("latestUnsavedSnapshot")

  const emit = defineEmits<{
    changeTeamColor: [number, ShirtColorEnum]
  }>()

  const location = useBrowserLocation()
  const overlay = useOverlay()
  const client = useClientQueries()

  const { mutateAsync: createSnapshotAsync } = client.snapshot.useCreate()

  const shareLeagueDialog = overlay.create(DialogShareLeague)

  const snapshot = computed(() => {
    const latestSavedSnapshot = snapshots[0]

    let snapshotToUse: Snapshot = { data: [] }

    if (latestUnsavedSnapshot.value) {
      snapshotToUse = latestUnsavedSnapshot.value
    } else if (latestSavedSnapshot) {
      snapshotToUse = latestSavedSnapshot
    }

    return SnapshotDataSchema.parse(snapshotToUse.data)
  })

  const onTeamsChanged = (teams: SnapshotPlayer[][]) => {
    latestUnsavedSnapshot.value = { data: teams }
  }

  const { shuffle, teams, isShuffled, movePlayer, addPlayerToTeam, removePlayerFromTeam } = useTeamShuffle(snapshot, onTeamsChanged)

  const teamsArray = computed(() =>
    teams.value.map((players, index) => ({
      teamNumber: index,
      players,
    })),
  )

  const toggleBookmark = async () => {
    await createSnapshotAsync({
      data: {
        data: {},
        leagueId,
      },
    })
  }

  const onShuffleTeams = () => {
    shuffle(players, leagueConfiguration)
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
        v-for="team in teamsArray"
        :key="team.teamNumber"
        data-testid="league-team"
        :team-name="`Team ${team.teamNumber + 1}`"
        :team-number="team.teamNumber"
        :team-color="leagueConfiguration.useTeamColors ? teamColors[team.teamNumber] : undefined"
        :available-colors="leagueConfiguration.useTeamColors ? (leagueConfiguration.teamColors as ShirtColorEnum[]) : undefined"
        :players="team.players"
        @move-player="movePlayer"
        @add-player="addPlayerToTeam"
        @remove-player="removePlayerFromTeam"
        @change-color="(teamNumber: number, color: ShirtColorEnum) => emit('changeTeamColor', teamNumber, color)" />
    </div>
  </div>
</template>
