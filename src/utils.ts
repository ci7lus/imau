export const generateRandomString = (length = 6) => {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const sleep = (ms: number) =>
  new Promise<void>((res) => {
    setTimeout(() => res(), ms)
  })
