import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ajout d'un proxy pour redirection en environnement de développement local
  // Frontend : démarré avec "npm run dev"
  // Backend : démarré avec "mvn spring-boot:run"
  // Attention, n'a pas d'intérêt dans un environnement dockérisé (vu que le frontend tourne dans un serveur nginx et que c'est lui qui fait la redirection)
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
