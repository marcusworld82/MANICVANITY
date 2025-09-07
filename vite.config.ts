import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'stripe-vendor': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'dnd-vendor': ['@hello-pangea/dnd'],
          'date-vendor': ['date-fns'],
          
          // Feature chunks
          'auth': ['src/context/AuthContext.tsx', 'src/components/Auth/SignInForm.tsx', 'src/components/Auth/SignUpForm.tsx'],
          'cart': ['src/context/CartContext.tsx', 'src/components/Cart/CartDrawer.tsx'],
          'command-center': ['src/pages/CommandCenter.tsx', 'src/pages/command-center/Kanban.tsx', 'src/pages/command-center/Calendar.tsx', 'src/pages/command-center/Ideas.tsx'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
