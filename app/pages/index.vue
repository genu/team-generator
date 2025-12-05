<script lang="ts" setup>
  import { DialogCreateLeague } from "#components"

  const overlay = useOverlay()
  const client = useClientQueries()

  const { mutateAsync: createAccountAsync } = client.account.useCreate()

  const createLeagueDialog = overlay.create(DialogCreateLeague)

  const createAccount = async () => {
    const account = await createAccountAsync({
      data: {},
      select: {
        hash: true,
        id: true,
      },
    })

    if (!account) throw new Error("Account creation failed unexpectedly")

    const res = createLeagueDialog.open({ accountId: account.id })
    const leagueId = await res.result

    await navigateTo(`/account/${account.hash}?league=${leagueId}`)
  }
</script>

<template>
  <div
    class="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-2 bg-gray-800 rounded-none lg:h-20 md:px-5 md:rounded-b-md">
    <h2
      class="relative text-base font-bold text-white capitalize cursor-pointer md:text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
      Team Generator
    </h2>
    <div class="absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
      <div class="w-full px-2">
        <UEmpty
          :ui="{ root: 'w-2/3 mx-auto' }"
          description="You have no leagues yet. Create a new league to get started."
          icon="i-lucide-users-round"
          :actions="[{ label: 'Setup a League', onClick: createAccount, variant: 'soft' }]" />
      </div>
    </div>
  </div>
</template>
