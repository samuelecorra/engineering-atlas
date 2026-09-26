import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./', import.meta.url));
export default defineConfig({
  plugins: [react(), tailwind()],
  // Do not load dotenv files; the application has no configuration secrets.
  envDir: false,
  server: {
    host: '127.0.0.1', port: 5173, strictPort: true,
    fs: { strict: true, allow: [root, fileURLToPath(new URL('../../node_modules', import.meta.url))] },
  },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
  build: {
    outDir: 'dist', sourcemap: false,
    rolldownOptions: { output: { codeSplitting: { groups: [
      // Keep the math engine separate within the lazily loaded reader.
      { name: 'math-engine', test: /node_modules[\\/]katex[\\/]/ },
    ] } } },
  },
  test: {
    environment: 'jsdom', setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'], restoreMocks: true,
  },
});
