export const useEncoding = () => {
  const encode = (data: any) => {
    return btoa(JSON.stringify(data))
  }

  const decode = (base64: string) => {
    if (base64 === undefined) return false

    const decoded = atob(base64)

    try {
      return JSON.parse(decoded)
    } catch (err) {
      console.log("invalid JSON string, can't parse:")
      console.log(`"${decoded}"`)

      return false
    }
  }

  return { encode, decode }
}
