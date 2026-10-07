# Architecture Portfolio

Interactive CV and portfolio. Its centrepiece is an explorable 3D model of a building I worked on.
Click any part of the building to see the Dynamo scripts, detail drawings and design work behind it.
Section and plan drawings are overlaid directly on the model.

> Status: template. All content is placeholder data.

## Features (planned)

- **CV**: profile, experience timeline, skills/software, education, PDF download
- **3D building explorer**: isometric view that orbits when idle; hover and click parts to inspect them
- **Part details**: Dynamo scripts (with Python preview), detail drawings and image gallery
- **Drawings on the model**: 2D sections placed in model space, with the model clipped at the cut
- **Deep links**: `?part=roof` opens the site with a part selected

## Stack

| Concern | Choice                                |
| ------- | ------------------------------------- |
| UI      | React 19 + TypeScript                 |
| Build   | Vite                                  |
| 3D      | three.js via React Three Fiber + drei |
| Styling | Tailwind CSS                          |
| Quality | oxlint, Prettier, Vitest              |
| Hosting | GitHub Pages (via GitHub Actions)     |

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

## Scripts

| Script                    | What it does                                      |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Start the dev server with hot reload              |
| `npm run build`           | Type-check and build to `dist/`                   |
| `npm run preview`         | Serve the production build locally                |
| `npm run lint`            | Lint with oxlint                                  |
| `npm run typecheck`       | Run the TypeScript compiler                       |
| `npm run format`          | Format all files with Prettier                    |
| `npm run format:check`    | Check formatting (used in CI)                     |
| `npm test`                | Run unit and content tests once                   |
| `npm run test:watch`      | Run tests in watch mode                           |
| `npm run check`           | Lint, typecheck, format check and tests           |
| `npm run content:schemas` | Regenerate JSON schemas after editing `schema.ts` |

## Editing content

All portfolio content lives in `src/content/` (typed data) and `public/` (models, drawings, files).
You should not need to touch component code to update the portfolio.

## License

Source code: [MIT](LICENSE). Portfolio content (drawings, models, images, CV): all rights reserved.
