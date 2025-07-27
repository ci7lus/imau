import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.DEPLOY_PRIME_URL": JSON.stringify(
      process.env.DEPLOY_PRIME_URL
    ),
  },
})
