import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  resolve: {
    alias: {
      'vue-mana-hooks': resolve(__dirname, 'src'),
    },
  },
  root: resolve(__dirname, 'demo'),
  plugins: [
    vue(), jsx(),
  ],
  server: {
    host: '0.0.0.0',
  },
})
