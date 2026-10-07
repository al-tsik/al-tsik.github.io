# Architecture Portfolio

An interactive CV laid out like a research paper. The CV sits in the centre,
an outline on the right, and a column of **figures** on the left: a 3D model
of a building I worked on, drawings, Dynamo scripts, galleries, videos and
animations.

> Status: template. All content is placeholder data.

## How it works

- **Click a bullet** to show its figures. **Sub-bullets** change the figures'
  views: highlight or rotate the model, place a section drawing on it, jump to
  an image, seek a video, play a Lottie marker, highlight Python lines.
- **Fig. N** cross-references in the text are numbered by first mention, like
  a paper.
- **Pop out** any figure into a large overlay. The 3D model becomes fully
  interactive there.
- **Numbered markers** (model labels, drawing callouts) link back to the
  related bullet.
- **Deep links**: the URL (`?b=…&fig=…`) restores what you're looking at.
- **Mobile**: figures appear inline under the tapped bullet.

## Stack

| Concern | Choice                                            |
| ------- | ------------------------------------------------- |
| UI      | React 19 + TypeScript                             |
| Build   | Vite                                              |
| 3D      | three.js via React Three Fiber + drei (lazy)      |
| State   | zustand                                           |
| Content | JSON validated by zod (+ generated JSON Schemas)  |
| Styling | Tailwind CSS (EB Garamond, Inter, JetBrains Mono) |
| Media   | prism-react-renderer, lottie-web (lazy)           |
| Quality | oxlint, Prettier, Vitest                          |
| Hosting | GitHub Pages via GitHub Actions                   |

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

## Editing content

See **[docs/editing-content.md](docs/editing-content.md)**: CV bullets and
figure views, figure types, replacing the 3D model with a Revit export,
placing drawings on the model, and publishing.

## Scripts

| Script                    | What it does                                      |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Start the dev server with hot reload              |
| `npm run build`           | Type-check and build to `dist/`                   |
| `npm run preview`         | Serve the production build locally                |
| `npm run check`           | Lint, typecheck, format check and tests           |
| `npm test`                | Run unit and content tests once                   |
| `npm run test:watch`      | Run tests in watch mode                           |
| `npm run lint`            | Lint with oxlint                                  |
| `npm run typecheck`       | Run the TypeScript compiler                       |
| `npm run format`          | Format all files with Prettier                    |
| `npm run format:check`    | Check formatting (used in CI)                     |
| `npm run content:schemas` | Regenerate JSON schemas after editing `schema.ts` |
| `npm run model:sample`    | Regenerate the placeholder 3D model               |

## Project structure

```
src/
  content/     JSON content, zod schemas, generated JSON Schemas, derived lookups
  lib/         pure logic with unit tests (figure focus, numbering, URL state…)
  features/
    cv/        the paper: title block, timeline, bullets, sections
    figures/   figure column, overlay and one renderer per figure type
    viewer/    the 3D model (controlled by a `view` prop)
    outline/   table of contents with scroll-spy
  state/       page-level interaction state (focused bullet, open figure)
public/        models, drawings, images, videos, animations, Dynamo files
```

## License

Source code: [MIT](LICENSE). Portfolio content (drawings, models, images, CV): all rights reserved.
