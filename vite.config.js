import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Oncology-DigitalTwin-OncoDT/',
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
})
