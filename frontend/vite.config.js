import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const isDev = mode !== 'production';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      headers: isDev
        ? {
            // Dev-only CSP to allow React Fast Refresh under CSP
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src *;",
          }
        : undefined,
    },
  };
});



