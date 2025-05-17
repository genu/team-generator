<script lang="ts" setup>
import { DialogCreateLeague } from '#components'

const overlay = useOverlay()

const { mutateAsync: createAccountAsync } = useCreateAccount()

const createLeagueDialog = overlay.create(DialogCreateLeague)

const createAccount = async () => {
  const account = await createAccountAsync({
    data: {},
    select: {
      hash: true,
      id: true,
    },
  })

  if (!account) throw new Error('Account creation failed unexpectedly')

  const res = createLeagueDialog.open({ accountId: account.id })

  const leagueId = await res.result

  await navigateTo(`/${account.hash}?league=${leagueId}`)
}
</script>

<template>
  <div
    class="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-2 bg-gray-800 rounded-none lg:h-20 md:px-5 md:rounded-b-md"
  >
    <h2
      class="relative text-base font-bold text-white capitalize cursor-pointer md:text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight"
    >
      Team Generator
    </h2>
    <div class="absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
      <div class="w-full px-2">
        <EmptyStateButton data-testid="btn-setup-league" icon="i-ph-users-three-light" label="Setup a league" @click="createAccount" />
      </div>
    </div>
  </div>
</template>
