import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

//added base
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/MyPortfolio/",
  build: {
    chunkSizeWarningLimit: 900,
  },
})
