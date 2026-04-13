import { defineConfig } from "vitest/config";

type NodeishGlobal = { process?: { env?: Record<string, string | undefined> } };

/** Project Pages live at `https://<user>.github.io/<repo>/` — must end with `/`. */
function githubPagesBase(): string {
  const raw = (globalThis as unknown as NodeishGlobal).process?.env?.GITHUB_PAGES_BASE?.trim();
  if (raw) {
    const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
    return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  }
  // Local `yarn build:pages` when env is unset (matches this repo’s remote name).
  return "/three.js-animations/";
}

export default defineConfig(({ mode }) => ({
  base: mode === "github-pages" ? githubPagesBase() : "/",
  test: {
    environment: "jsdom",
    globals: false,
  },
}));
