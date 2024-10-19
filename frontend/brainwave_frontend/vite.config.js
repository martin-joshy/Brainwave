import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.js'],
  },
  optimizeDeps: {
    include: [
      '@mui/material/Unstable_Grid2',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip',
    ],
  },
});
