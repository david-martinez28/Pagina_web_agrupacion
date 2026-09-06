import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Esto evita que se generen archivos que permiten reconstruir tu código original
    sourcemap: false, 
    // Esto comprime el código, cambia los nombres de variables a una sola letra y quita los espacios
    minify: 'terser', 
  }
})
