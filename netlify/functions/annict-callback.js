const axios = require("axios")

exports.handler = async (event, context) => {
  const { code, state } = event.queryStringParameters
  if (typeof code !== "string") {
    return {
      statusCode: 200,
      body: "",
    }
  }
  const result = await axios.post("https://api.annict.com/oauth/token", {
    grant_type: "authorization_code",
    code,
    client_id: process.env.VITE_ANNICT_CLIENT_ID,
    client_secret: process.env.ANNICT_CLIENT_SECRET,
    redirect_uri: process.env.VITE_ANNICT_REDIRECT_URL,
  })
  return {
    statusCode: 301,
    headers: {
      Location: `/?annict_access_token=${result.data.access_token}`,
    },
  }
}
