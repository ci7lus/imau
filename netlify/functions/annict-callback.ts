import type { Handler, HandlerResponse } from "@netlify/functions"

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
  const result = await fetch("https://api.annict.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "imau/1.0 (+https://imau.netlify.app)",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
    }),
  })
  const data = (await result.json()) as { access_token?: unknown }
  if (typeof data.access_token !== "string") {
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
    body: `<script>localStorage.setItem("ANNICT_ACCESS_TOKEN", ${JSON.stringify(data.access_token)});history.replaceState({}, document.title, "/");location.reload()</script>`,
  }
}

export { handler }
