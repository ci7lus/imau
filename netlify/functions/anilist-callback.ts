import type { Handler, HandlerResponse } from "@netlify/functions"
import axios from "axios"
import cookie from "cookie"

const clientId = process.env.VITE_ANILIST_CLIENT_ID
const clientSecret = process.env.ANILIST_CLIENT_SECRET
const deployUrl =
  process.env.CONTEXT === "production"
    ? process.env.URL
    : process.env.DEPLOY_PRIME_URL
if (!clientId || !clientSecret || !deployUrl) {
  throw new Error("Missing environment variables")
}
const redirectUrl = `${deployUrl}/.netlify/functions/anilist-callback`

const handler: Handler = async (event): Promise<HandlerResponse> => {
  if (!event.queryStringParameters) {
    return { statusCode: 400 }
  }
  const { code, state, error } = event.queryStringParameters
  if (typeof error === "string") {
    return {
      statusCode: 403,
      body: "access denied.",
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
    "https://anilist.co/api/v2/oauth/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      code_verifier: challange,
    }),
    {
      headers: {
        "User-Agent": "imau/1.0 (+https://imau.netlify.app)",
      },
    }
  )
  if (typeof result.data.access_token !== "string") {
    return {
      statusCode: 400,
    }
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: `<script>localStorage.setItem("ANILIST_ACCESS_TOKEN", ${JSON.stringify(result.data.access_token)});history.replaceState({}, document.title, "/");location.reload()</script>`,
  }
}

export { handler }
