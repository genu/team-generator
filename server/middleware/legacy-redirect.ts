export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Match any path that looks like a UUID directly at root level
  // Example: /fc7fee0f-4900-4e86-a92f-dc050b721dfb or /fc7fee0f-4900-4e86-a92f-dc050b721dfb?league=43
  const uuidPattern = /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(\/.*)?$/i
  const match = url.pathname.match(uuidPattern)

  if (match && !url.pathname.startsWith("/account/")) {
    const accountId = match[1]
    const remainingPath = match[2] || ""

    // Preserve query parameters
    const queryString = url.search || ""

    // Redirect to /account/:id with query params preserved
    const redirectUrl = `/account/${accountId}${remainingPath}${queryString}`

    return sendRedirect(event, redirectUrl, 301)
  }
})
