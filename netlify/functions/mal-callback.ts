import { Handler } from "@netlify/functions"
import axios from "axios"
import cookie from "cookie"

const handler: Handler = async (event) => {
  const { code, state, error } = event.queryStringParameters
  if (typeof error === "string") {
    return {
      statusCode: 403,
      body: "access denied.",
      headers: {
        Location: "/",
      },
    }
  }
  if (typeof code !== "string" || typeof state !== "string") {
    return {
      statusCode: 400,
      body: "Bad request",
    }
  }
  const cookies = cookie.parse(event.headers.cookie || "")
  const challange = cookies.challlange
  if (!challange) {
    return {
      statusCode: 400,
      body: "Bad request(challlange not found)",
    }
  }
  const result = await axios.post(
    "https://myanimelist.net/v1/oauth2/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.VITE_MAL_CLIENT_ID,
      client_secret: process.env.MAL_CLIENT_SECRET,
      redirect_uri: process.env.VITE_MAL_REDIRECT_URL,
      code_verifier: challange,
    }),
    {
      headers: {
        "User-Agent": "imau/1.0 (+https://imau.netlify.app)",
      },
    }
  )
  return {
    statusCode: 301,
    headers: {
      Location: `/?mal_access_token=${result.data.access_token}`,
    },
  }
}

export { handler }
