import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// Standalone on purpose: vite.config.ts pulls in the full Lovable/TanStack Start
// plugin stack, which unit tests don't need.
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Exposes .env / .env.local (e.g. RESEND_API_KEY) to the live Resend test.
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
