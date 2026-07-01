import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { base44 } from "@base44/vite-plugin";

export default defineConfig({
  plugins: [
    base44({
      // Enable only if you still use old @/entities, @/integrations imports
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === "true",

      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true,
    }),
    react(),
  ],

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
