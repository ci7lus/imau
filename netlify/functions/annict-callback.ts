import { Handler } from "@netlify/functions"
import axios from "axios"

const handler: Handler = async (event) => {
  const { code, error } = event.queryStringParameters
  if (typeof error === "string") {
    return {
      statusCode: 403,
      body: "access denied.",
      headers: {
        Location: "/",
      },
    }
  }
  if (typeof code !== "string") {
    return {
      statusCode: 400,
      body: "Bad request",
    }
  }
  const result = await axios.post(
    "https://api.annict.com/oauth/token",
    {
      grant_type: "authorization_code",
      code,
      client_id: process.env.VITE_ANNICT_CLIENT_ID,
      client_secret: process.env.ANNICT_CLIENT_SECRET,
      redirect_uri: process.env.VITE_ANNICT_REDIRECT_URL,
    },
    {
      headers: {
        "User-Agent": "imau/1.0 (+https://imau.netlify.app)",
      },
    }
  )
  return {
    statusCode: 301,
    headers: {
      Location: `/?annict_access_token=${result.data.access_token}`,
    },
  }
}

export { handler }
