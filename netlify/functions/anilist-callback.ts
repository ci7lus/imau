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
    "https://anilist.co/api/v2/oauth/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.VITE_ANILIST_CLIENT_ID,
      client_secret: process.env.ANILIST_CLIENT_SECRET,
      redirect_uri: process.env.VITE_ANILIST_REDIRECT_URL,
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
      body: "try again",
    }
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: `<script>localStorage.setItem("ANILIST_ACCESS_TOKEN", ${JSON.stringify(result.data.access_token)});history.replaceState({}, document.title, "/");location.reload()</script>`
  }
}

export { handler }
