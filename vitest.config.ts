import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// `server-only` lanza fuera de un Server Component; en los tests lo sustituimos
// por un módulo vacío para poder importar los helpers puros de `src/lib`.
export default defineConfig({
  resolve: {
    alias: {
      "server-only": fileURLToPath(new URL("./test/stubs/server-only.ts", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
  },
});
