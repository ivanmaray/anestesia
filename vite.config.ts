import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración Vite. La sección de pruebas se gestiona vía Vitest CLI (scripts npm) sin clave 'test' aquí.
export default defineConfig({
  plugins: [react()]
})
