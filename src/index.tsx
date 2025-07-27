import React from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"

// biome-ignore lint/style/noNonNullAssertion: root
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
