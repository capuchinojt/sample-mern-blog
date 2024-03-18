import MillionLint from '@million/lint';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
var plugins = [react()];
plugins.unshift(MillionLint.vite())
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5555',
        secure: false
      }
    }
  },
  plugins: plugins
});