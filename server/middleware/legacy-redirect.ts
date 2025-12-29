export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Match any path that looks like a UUID or hash directly at root level
  // Examples:
  // - UUID: /fc7fee0f-4900-4e86-a92f-dc050b721dfb?league=43
  // - Hash: /TS0q26z134VLzKzRFQCRG?league=87
  const accountPattern = /^\/([0-9a-zA-Z_-]+)(\/.*)?$/i
  const match = url.pathname.match(accountPattern)

  // Only redirect if:
  // 1. Pattern matches
  // 2. Not already under /account/
  // 3. Not a known route (api, _nuxt, etc.)
  if (match && !url.pathname.startsWith("/account/") && !url.pathname.startsWith("/api/") && !url.pathname.startsWith("/_nuxt/")) {
    const accountId = match[1]
    const remainingPath = match[2] || ""

    // Preserve query parameters
    const queryString = url.search || ""

    // Redirect to /account/:id with query params preserved
    const redirectUrl = `/account/${accountId}${remainingPath}${queryString}`

    return sendRedirect(event, redirectUrl, 301)
  }
})
