import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'AsyncScriptLoader',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  },
  plugins: [dts({ rollupTypes: true })]
});
