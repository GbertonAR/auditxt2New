// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // ✅ Carga las variables de entorno (solo en tiempo de build)
  const env = loadEnv(mode, process.cwd(), '');

  // 📅 Log útil solo durante desarrollo
  const now = new Date();
  console.log(`🕒 Build ejecutado el: ${now.toLocaleString()}`);
  console.log("🌍 VITE_API_URL:", env.VITE_API_URL);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // ✅ Este proxy solo funciona en modo desarrollo (npm run dev)
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // ✅ Define variables de entorno accesibles globalmente si querés forzar fallback
    define: {
      'process.env': {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL),
      },
    },
  };
});
