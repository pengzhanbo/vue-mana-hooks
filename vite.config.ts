import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'vue-mana-hooks': resolve(__dirname, 'src'),
    },
  },
  root: resolve(__dirname, 'demo'),
  plugins: [vue(), jsx()],
  server: {
    host: '0.0.0.0',
  },
})
