import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/nckh2026/',
  server: {
    host: '0.0.0.0'
  }
});
