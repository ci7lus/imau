import type { Handler, HandlerResponse } from "@netlify/functions"
import { parseCookie } from "cookie"

const clientId = process.env.VITE_MAL_CLIENT_ID
const clientSecret = process.env.MAL_CLIENT_SECRET
const deployUrl = process.env.URL
if (!clientId || !clientSecret || !deployUrl) {
  throw new Error("Missing environment variables")
}
const redirectUrl = `${deployUrl}/.netlify/functions/mal-callback`

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
  const cookies = parseCookie(event.headers.cookie || "")
  const challange = cookies.challlange
  if (!challange) {
    return {
      statusCode: 400,
      body: "Bad request(challlange not found)",
    }
  }
  const result = await fetch("https://myanimelist.net/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "imau/1.0 (+https://imau.netlify.app)",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      code_verifier: challange,
    }),
  })
  const data = (await result.json()) as { access_token?: unknown }
  if (typeof data.access_token !== "string") {
    console.warn(data)
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
    body: `<script>localStorage.setItem("MAL_ACCESS_TOKEN", ${JSON.stringify(data.access_token)});history.replaceState({}, document.title, "/");location.reload()</script>`,
  }
}

export { handler }
