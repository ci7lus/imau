const axios = require("axios")
const cookie = require("cookie")

exports.handler = async (event, context) => {
  const { code, state } = event.queryStringParameters
  if (typeof code !== "string" || typeof state !== "string") {
    return {
      statusCode: 400,
      body: "Bad request",
    }
  }
  const cookies = cookie.parse(event.headers.cookie || "")
  const challange = cookies.challlange
  console.log(challange)
  if (!challange) {
    return {
      statusCode: 400,
      body: "Bad request(challlange not found)",
    }
  }
  const result = await axios.post(
    "https://myanimelist.net/v1/oauth2/token",
    Object.entries({
      grant_type: "authorization_code",
      code,
      client_id: process.env.VITE_MAL_CLIENT_ID,
      client_secret: process.env.MAL_CLIENT_SECRET,
      redirect_uri: process.env.VITE_MAL_REDIRECT_URL,
      code_verifier: challange,
    })
      .map(([k, v]) => [k, v].join("="))
      .join("&"),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  )
  return {
    statusCode: 301,
    headers: {
      Location: `/?mal_access_token=${result.data.access_token}`,
    },
  }
}
