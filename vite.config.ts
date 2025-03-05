import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // SWC config options
      jsxImportSource: undefined,
      tsDecorators: false,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Use esbuild minification in development for faster builds
    minify: mode === 'production' ? 'terser' : 'esbuild',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Main vendor bundle 
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI components bundle
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'lucide-react'
          ],
          
          // Features bundle
          features: [
            'date-fns',
            '@tanstack/react-query',
            '@supabase/supabase-js'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Generate source maps only in development
    sourcemap: mode !== 'production',
  },
  optimizeDeps: {
    // Improve first load time by pre-bundling these dependencies
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    // Exclude large dependencies from pre-bundling if they're not needed on initial load
    exclude: ['recharts']
  },
  // Reduce build size by excluding dev-only code in production
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    __DEV__: mode !== 'production',
  },
}));
