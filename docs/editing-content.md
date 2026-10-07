# Editing the portfolio

All content lives in four JSON files in `src/content/` and the media in `public/`.
You never need to touch component code to update the site.

| File            | What it holds                                                      |
| --------------- | ------------------------------------------------------------------ |
| `profile.json`  | Name, role, location, abstract (summary), links, PDF               |
| `cv.json`       | Experience (bullets, sub-bullets), education, skills, certificates |
| `figures.json`  | Every figure in the left column (model, drawings, videos…)         |
| `building.json` | The 3D model, its parts, Dynamo scripts and on-model drawings      |

Open them in VS Code: the `"$schema"` line at the top of each file gives you
autocomplete, hover docs and red underlines for mistakes.

**Always run `npm run check` after editing.** Besides lint and types, it runs
content tests that catch broken links: unknown figure ids, missing files,
mesh names that aren't in the model, gallery indexes out of range, and so on.
Each failure names the exact value to fix.

---

## CV lines and figures

Every bullet and sub-bullet is a **line**, and a line can have **one** figure,
written as the figure id plus how to show it:

```jsonc
{
  "id": "structure-model", // optional; needed to link to this line
  "text": "Modelled the structural grid and slab edges (see {fig:section-a-a}).",
  "figure": { "figure": "building-model", "parts": ["floors", "core"] },
  "children": [
    {
      "id": "core-section",
      "text": "Section through the core and slabs.",
      "figure": { "figure": "building-model", "parts": ["floors"], "drawing": "section-a-a" },
    },
    {
      "text": "Python node that numbers the panels.",
      "figure": { "figure": "panel-numbering-code", "lines": [43, 46] },
    },
  ],
}
```

- **Hover** a line to preview its figure in the margin, level with the line.
- **Click** a line to pin its figure and bring the line to the reading
  position. Click again (or press Escape) to unpin.
- At rest, a few random lines show their figures; they reshuffle on reload.
- A sub-bullet without its own `figure` shows its parent's.
- The same figure on consecutive lines (e.g. the model in different views)
  animates between views instead of reloading.
- **`{fig:id}`** in any text renders as "Fig. N". Figures are numbered by
  their first mention in the CV, like a paper, so reordering never breaks
  them.

### View fields per figure type

| Figure type   | View fields                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| model         | `parts`, `drawing` (from building.json), `azimuth`, `elevation` (15–60), `zoom` |
| gallery       | `image` (0-based index)                                                         |
| video         | `time`, `until` (seconds)                                                       |
| animation     | `marker` (Lottie marker name)                                                   |
| drawing/image | `region`: `[x, y, width, height]` in % of the figure                            |
| dynamo        | `region` (graph zoom)                                                           |
| code          | `lines`: `[from, to]` to highlight                                              |

## Figures (`figures.json`)

Every figure needs `id`, `type`, `caption` and `alt` (a description for screen
readers). On load the column shows the model plus two random figures.

| Type        | Fields                                          | Notes                                                                                      |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `model`     | –                                               | Uses `building.json`. Only one needed.                                                     |
| `drawing`   | `src`, `callouts`                               | SVG. Callouts: `{ number, x, y, target: { bullet \| figure \| part } }`, x/y in %.         |
| `image`     | `src`                                           | Any web image.                                                                             |
| `gallery`   | `images: [{ src, alt, caption }]`, `intervalMs` | Cross-fades; pauses on hover.                                                              |
| `video`     | `src` + `poster`, or `embed`                    | Local: short, muted MP4/WebM (aim for < 5 MB). `embed`: YouTube/Vimeo URL, loads on click. |
| `animation` | `src`                                           | Animated `.svg`, or Lottie `.json` with named markers.                                     |
| `dynamo`    | `scriptId`                                      | The graph of a script listed under a part in `building.json`.                              |
| `code`      | `src`, `language`                               | A source file (Python, JavaScript, TypeScript, JSON) with syntax highlighting.             |

Media tips:

- **SVG drawings**: export with `width`/`height` attributes so they render
  sharply as textures on the model.
- **Video**: compress, e.g.
  `ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 28 -an -movflags +faststart out.mp4`.
- **Lottie**: add markers in After Effects (layer markers with a comment) and
  reference them by name in sub-bullet views.

## The 3D model (`building.json`)

Each part maps to **glTF node names** in the model file:

```jsonc
{
  "id": "facade",
  "number": 4, // label on the model and in links
  "name": "Facade",
  "summary": "Shown as the label's tooltip.",
  "meshNames": ["facade-n", "facade-s"],
  "labelPosition": [4.5, 11, 6.3], // optional, metres, Y up
  "dynamoScripts": [/* title, description, graph image */],
  "drawings": [/* sheets placed on the model, see below */],
}
```

### Replacing the sample model with your own

1. Export the Revit model to glTF/GLB, either with a glTF exporter add-in or
   via IFC → Blender (with an IFC add-on) → glTF. Use **metres** and **Y up**.
2. Name or group the elements so each building part has a recognisable node
   name (a node's ancestors count, so a named group works).
3. Put the file in `public/models/` and set `model.src`.
4. Update each part's `meshNames` and run `npm test`. The test
   _"every meshName is a node in the building model"_ lists any name that
   doesn't match.
5. Keep the file small: remove furniture and interiors you don't need. The
   viewer recolours everything as a white card model, so materials don't
   matter.

`npm run model:sample` regenerates the placeholder model.

### Drawings on the model

```jsonc
{
  "id": "section-a-a",
  "title": "Section A-A",
  "kind": "section",
  "src": "/drawings/section-a-a.svg",
  "placement": { "position": [0, 6.5, 0], "rotation": [0, 0, 0], "width": 20, "height": 17 },
  "clip": true, // cut away the model in front of the sheet
}
```

`position` is the sheet's centre in model metres. `rotation` is in degrees:
`[0, 0, 0]` is a vertical sheet facing +Z, `[0, 90, 0]` faces +X and
`[-90, 0, 0]` lies flat (a plan). Draw sheets to scale (e.g. 100 px per metre)
so they line up with the model. Show them through a sub-bullet view:
`{ "figure": "building-model", "drawing": "section-a-a" }`.

## Deep links

The address bar mirrors the state, so any view can be shared:
`/?b=<bullet id>` focuses a bullet or sub-bullet, and `&fig=<figure id>` opens
a figure in the overlay.

## Publishing

1. In the GitHub repository, open _Settings → Pages_ and set **Source** to
   **GitHub Actions**.
2. Push to `main`. CI runs every check, and only then deploys.

Where the site appears depends on the repository name, and CI sets the
base path to match:

- `<username>.github.io` is served at `https://<username>.github.io/`.
- Any other name, e.g. `altsik.github.io` under user `al-tsik`, is served at
  `https://al-tsik.github.io/altsik.github.io/`.

Content paths in the JSON always start with `/` and are resolved against the
base automatically.
