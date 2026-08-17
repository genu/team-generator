const GAME_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

/**
 * Formats a 24h "HH:MM" game time into a readable 12h label (e.g. "18:30" -> "6:30 PM").
 * Returns undefined when no valid time is set.
 */
export const formatGameTime = (gameTime?: string | null) => {
  if (!gameTime) return undefined

  const match = GAME_TIME_PATTERN.exec(gameTime)
  if (!match) return undefined

  const hours = Number(match[1])
  const minutes = match[2]
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 === 0 ? 12 : hours % 12

  return `${displayHours}:${minutes} ${period}`
}

export const useGameTime = (gameTime: MaybeRefOrGetter<string | null | undefined>) => {
  const formattedGameTime = computed(() => formatGameTime(toValue(gameTime)))

  return { formattedGameTime }
}
