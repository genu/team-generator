import LogRocket from 'logrocket'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (process.env.NODE_ENV !== 'development') {
    LogRocket.init(config.public.logrocketAppId, {})
  }
})
