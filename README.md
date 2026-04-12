![GitHub package.json version](https://img.shields.io/github/package-json/v/ashutilov/three.js-animations)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/ashutilov/three.js-animations)
![GitHub top language](https://img.shields.io/github/languages/top/ashutilov/three.js-animations)
![Lines of code](https://img.shields.io/tokei/lines/github/ashutilov/three.js-animations)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ashutilov/three.js-animations)

# Project Title

Sandbox for three.js, built with [Vite](https://vitejs.dev/) and TypeScript.

Several experiments that used to live on separate Git branches are combined here: pick an example from the **tab bar** at the top of the page. Only one WebGL view runs at a time so switching tabs disposes the previous demo and mounts the next (better for performance than stacking every canvas on one screen).

## Getting started

Install dependencies:

```bash
yarn install
```

## Development

Start the Vite dev server (with hot reload):

```bash
yarn dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

Static assets served as-is from the project live in [`public/`](public/) (for example `favicon.png`).

## Production build

Create an optimized bundle in `dist/`:

```bash
yarn build
```

Preview the production build locally:

```bash
yarn preview
```

## Quality checks

| Script            | Description                |
| ----------------- | -------------------------- |
| `yarn lint`       | ESLint                     |
| `yarn typecheck`  | TypeScript (`tsc --noEmit`) |
| `yarn test`       | Vitest (unit tests)        |
| `yarn test:watch` | Vitest watch mode          |

There is no coverage step in this project.
