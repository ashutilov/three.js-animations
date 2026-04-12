import { defineConfig } from "vitest/config";

/** GitHub project Pages URL: https://<user>.github.io/<repo>/ */
const pagesBase = "/three.js-animations/";

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? pagesBase : "/",
  test: {
    environment: "jsdom",
    globals: false,
  },
}));
