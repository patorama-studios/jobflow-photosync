
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Optimize HMR for better development experience
    hmr: {
      overlay: true,
    },
  },
  // Use absolute base path for production, relative for development
  base: mode === 'production' ? '/' : './',
  // Add caching for improved performance
  cacheDir: '.vite-cache',
  plugins: [
    react({
      // Use SWC's configuration
      jsxImportSource: undefined,
      tsDecorators: false,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add alias for critical libraries to ensure consistent imports
      "lodash": path.resolve(__dirname, "node_modules/lodash"),
      "lodash/*": path.resolve(__dirname, "node_modules/lodash/*"),
      "react-is": path.resolve(__dirname, "node_modules/react-is"),
    },
  },
  // Enable asset optimizations
  build: {
    // Use esbuild minification for faster builds
    minify: mode === 'production' ? 'esbuild' : false,
    // Enable reportCompressedSize for better size analysis in production
    reportCompressedSize: mode === 'production',
    // Enable asset compression
    assetsInlineLimit: 4096,
    // Improved CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      external: ['mysql2', 'bcryptjs', 'jsonwebtoken'],
      output: {
        // Use ES module format for better compatibility
        format: 'es',
        // Simplify output naming for easier debugging and better compatibility
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: (id) => {
          // Core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          
          // React utilities
          if (id.includes('node_modules/react-is')) {
            return 'vendor-react-utils';
          }
          
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          
          // UI components
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          
          // Data fetching
          if (id.includes('node_modules/@tanstack/react-query') || 
              id.includes('node_modules/@supabase')) {
            return 'vendor-data';
          }
          
          // Utilities and date libraries
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'vendor-utils';
          }
          
          // Charts and visualization - separate chunk to handle lodash dependencies
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          
          // Lodash as a separate chunk to avoid conflicts
          if (id.includes('node_modules/lodash')) {
            return 'vendor-lodash';
          }
          
          // Everything else from node_modules
          if (id.includes('node_modules')) {
            return 'vendor-others';
          }
        }
      },
      // Improve tree-shaking
      treeshake: mode === 'production',
    },
    // Increase chunk size warning to avoid unnecessary splitting
    chunkSizeWarningLimit: 1200,
    // Generate source maps only in development
    sourcemap: mode !== 'production',
  },
  optimizeDeps: {
    // Improve first load time by pre-bundling these dependencies
    include: [
      'react', 
      'react-dom',
      'react-is',
      'react-router-dom', 
      '@tanstack/react-query',
      'clsx',
      'tailwind-merge',
      'date-fns',
      'lucide-react',
      'lodash',
      'lodash/get',
      'lodash/debounce',
      'lodash/merge',
    ],
    // Exclude Node.js server-side dependencies and large dependencies
    exclude: ['recharts', 'mysql2', 'bcryptjs', 'jsonwebtoken'],
    // Enable dependency optimization in development mode for faster reloads
    force: true,
  },
  // Reduce build size by excluding dev-only code in production
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    '__DEV__': mode !== 'production',
  },
  // Improved esbuild configuration
  esbuild: {
    // Enable JSX optimization
    jsx: 'automatic',
    // Use native ESBuild minification for JS
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
    // Improve tree-shaking in production
    treeShaking: mode === 'production',
  },
}));
