import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    modulePreload: {
      // Vite's default also preloads a lazily-imported chunk's own
      // dependencies (e.g. @base-ui/react, used only by the lazy AuthPage)
      // via <link rel="modulepreload"> unconditionally in index.html, which
      // silently forces it onto every first load regardless of whether
      // AuthPage ever renders. Only the vendor-baseui bucket is exclusively
      // reached through a lazy import, so it's the one safe to exclude —
      // every other preloaded chunk here is a genuine static dependency of
      // the eager entry (vendor-react/router/i18n/icons/forms) and should
      // keep preloading to avoid a fetch waterfall for those.
      resolveDependencies: (_filename, deps, { hostType }) =>
        hostType === 'html'
          ? deps.filter((dep) => !dep.includes('vendor-baseui'))
          : deps,
    },
    rolldownOptions: {
      output: {
        manualChunks(id) {
          // pnpm nests packages under .pnpm/<pkg>@ver_<peer>@ver/node_modules/<pkg>/...
          // so a loose substring match on `id` can false-match peer-dep suffixes
          // baked into that hash directory name. Extract the real package name
          // from the last `node_modules/` segment instead.
          const segments = id.split('/node_modules/');
          if (segments.length < 2) return;
          const pkgPath = segments[segments.length - 1];
          const pkgName = pkgPath.startsWith('@')
            ? pkgPath.split('/').slice(0, 2).join('/')
            : pkgPath.split('/')[0];

          if (['react', 'react-dom', 'scheduler'].includes(pkgName))
            return 'vendor-react';
          if (['react-router', 'react-router-dom'].includes(pkgName))
            return 'vendor-router';
          if (['i18next', 'react-i18next'].includes(pkgName))
            return 'vendor-i18n';
          if (pkgName === 'lucide-react') return 'vendor-icons';
          if (
            [
              'zustand',
              'zod',
              'react-hook-form',
              '@hookform/resolvers',
            ].includes(pkgName)
          )
            return 'vendor-forms';
          return 'vendor-baseui';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
