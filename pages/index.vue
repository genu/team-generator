<script lang="ts" setup>
const accountQuery = useAccount()
const router = useRouter()

const { mutateAsync: createAccountAsync } = accountQuery.create()
const createAccountStatus = ref(DataStatus.DEFAULT)

const createAccount = async () => {
  const { hash } = await createAccountAsync()

  router.push(`/${hash}`)
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
    <div class="absolute absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
      <div class="w-full px-2">
        <button
          type="button"
          class="relative block p-8 mx-auto my-4 text-center border-2 border-gray-300 border-dashed rounded-lg w-2/3 lg:w-1/3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="createAccount"
          :disabled="createAccountStatus === DataStatus.SUCCESS || createAccountStatus === DataStatus.PENDING"
        >
          <UIcon
            name="i-ph-users-three-light"
            class="text-6xl text-gray-400"
            v-if="createAccountStatus === DataStatus.DEFAULT"
          />

          <UIcon name="i-ph-spinner-bold" class="text-6xl text-gray-400 animate-spin" v-else />
          <span class="block mt-4 text-sm font-medium text-gray-900">Setup a league</span>
        </button>
      </div>
    </div>
  </div>
</template>
