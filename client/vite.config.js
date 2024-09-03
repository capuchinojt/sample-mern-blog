import MillionLint from '@million/lint'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import jsconfigPath from 'vite-jsconfig-paths'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
const plugins = [react(), jsconfigPath()];
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
  resolve: {
    resolve: {
      '@/': path.resolve(__dirname, './src/')
    },
  },
  plugins: plugins,
  base: '/sample-mern-blog/'
});