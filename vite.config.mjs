import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      lines: 70,
      statements: 70,
      functions: 70,
      branches: 50,
      include: [
        "src/components/**/*.{js,jsx}",
        "src/hooks/**/*.{js,jsx}",
        "src/utils/**/*.{js,jsx}"
      ],
      exclude: [
        ...configDefaults.coverage.exclude,
        "src/components/ui/Header.jsx"
      ]
    }
  }
});
