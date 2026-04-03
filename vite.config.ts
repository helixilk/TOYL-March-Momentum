import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import netlify from '@netlify/vite-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Inject non-VITE_ vars into process.env so Netlify function emulation can read them
    Object.assign(process.env, env);
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), netlify()],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
