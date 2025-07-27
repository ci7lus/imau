import type { Handler, HandlerResponse } from "@netlify/functions"
import axios from "axios"

const clientId = process.env.VITE_ANNICT_CLIENT_ID
const clientSecret = process.env.ANNICT_CLIENT_SECRET
const deployUrl = process.env.URL
if (!clientId || !clientSecret || !deployUrl) {
  throw new Error("Missing environment variables")
}
const redirectUrl = `${deployUrl}/.netlify/functions/annict-callback`

const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (!event.queryStringParameters) {
    return { statusCode: 400 }
  }
  const { code, error } = event.queryStringParameters
  if (typeof error === "string") {
    return {
      statusCode: 403,
      body: "access denied.",
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
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
    },
    {
      headers: {
        "User-Agent": "imau/1.0 (+https://imau.netlify.app)",
      },
    }
  )
  if (typeof result.data.access_token !== "string") {
    return {
      statusCode: 400,
      body: "try again",
    }
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: `<script>localStorage.setItem("ANNICT_ACCESS_TOKEN", ${JSON.stringify(result.data.access_token)});history.replaceState({}, document.title, "/");location.reload()</script>`,
  }
}

export { handler }
