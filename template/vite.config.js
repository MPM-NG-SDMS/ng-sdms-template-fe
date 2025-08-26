import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { getGitCommitHash } from './src/lib/gitRev'
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'import.meta.env.VITE_GIT_COMMIT_HASH': JSON.stringify(getGitCommitHash()),
    },
    base: env.VITE_BASE_URL_APP || '/',
    server: {
      port: '{{DOMAIN_PORT}}'
    },
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      federation({
        name: '{{DOMAIN_NAME}}',
        filename: 'remoteEntry.js',
        exposes: {
          './entry': './src/entry.js',
        },
        shared: ['vue'],
      }),
    ],
    esbuild: {
      drop: ['console'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})
