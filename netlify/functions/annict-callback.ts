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
    body: `<script>localStorage.setItem("ANNICT_ACCESS_TOKEN", ${JSON.stringify(result.data.access_token)});history.replaceState({}, document.title, "/");location.reload()</script>`
  }
}

export { handler }
