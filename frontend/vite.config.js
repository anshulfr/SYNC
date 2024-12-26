import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shadcn/ui': path.resolve(__dirname, 'node_modules/@shadcn/ui'),
      '@': path.resolve(__dirname, 'src'), // This allows you to use '@' as an alias for the 'src' directory
    },
  },
})
