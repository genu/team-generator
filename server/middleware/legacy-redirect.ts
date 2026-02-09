export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Match legacy account URLs at root level:
  // - UUID: /fc7fee0f-4900-4e86-a92f-dc050b721dfb?league=43
  // - Hash: /TS0q26z134VLzKzRFQCRG?league=87
  const accountPattern = /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-zA-Z_-]{20,})(\/.*)?$/i
  const match = url.pathname.match(accountPattern)

  if (match) {
    const accountId = match[1]
    const remainingPath = match[2] || ""

    // Preserve query parameters
    const queryString = url.search || ""

    // Redirect to /account/:id with query params preserved
    const redirectUrl = `/account/${accountId}${remainingPath}${queryString}`

    return sendRedirect(event, redirectUrl, 301)
  }
})
