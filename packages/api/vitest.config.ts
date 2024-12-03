import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enables global test APIs like `describe` and `it`
    environment: "node", // Use 'jsdom' for frontend projects
    coverage: {
      reporter: ["text", "json", "html"], // Optional: Generates coverage reports
    },
  },
  plugins: [tsconfigPaths()],
});
