import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: [
      'test-penny-counsel-selections.trycloudflare.com'
    ]
  }
})
