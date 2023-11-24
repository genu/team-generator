<script lang="ts" setup>
const accountQuery = useAccount()
const router = useRouter()

const { mutateAsync: createAccountAsync } = accountQuery.create()
const createAccountStatus = ref(DataStatus.DEFAULT)

const createAccount = async () => {
  createAccountStatus.value = DataStatus.PENDING
  const { hash } = await createAccountAsync()

  await router.push(`/${hash}?isAddingNewLeague=true`)
  createAccountStatus.value = DataStatus.SUCCESS
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
        <EmptyStateButton
          icon="i-ph-users-three-light"
          label="Setup a league"
          @click="createAccount"
          :disabled="createAccountStatus === DataStatus.SUCCESS || createAccountStatus === DataStatus.PENDING"
          :loading="createAccountStatus === DataStatus.PENDING"
        />
      </div>
    </div>
  </div>
</template>
