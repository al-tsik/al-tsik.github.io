import { z } from 'zod'
// Explicit .ts extension: this file is also imported by Node scripts
// (scripts/generate-json-schemas.ts), which need full specifiers.
import { publicUrl } from '../lib/publicUrl.ts'

/*
 * Content schemas: the single source of truth for the shape of everything in
 * src/content/*.json. TypeScript types are inferred from these, and JSON Schema
 * files for editor autocomplete are generated from them.
 */

/** Lowercase kebab-case identifier, e.g. "roof" or "level-01". */
const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase kebab-case, e.g. "level-01"')

/** "YYYY-MM", e.g. "2023-09", or just the year, e.g. "2023". */
const YearMonth = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, 'Use YYYY-MM or YYYY, e.g. "2023-09" or "2023"')

/** A point in model space: [x, y, z] in metres, Y up. */
const Vec3 = z.tuple([z.number(), z.number(), z.number()])

/**
 * Path to a file served from public/, e.g. "/images/roof.jpg". Parsed values
 * are resolved against the site base, so the site also works under a
 * sub-path (GitHub Pages project site); the JSON always uses "/...".
 */
const PublicPath = z
  .string()
  .startsWith('/', 'Paths are relative to public/ and start with "/"')
  .transform(publicUrl)

/** The CV can be read as a developer's or an architect's CV, or both. */
export const AudienceSchema = z.enum(['developer', 'architect'])

/** Limits an entry to some views. Left out, the entry shows in every view. */
const For = z
  .array(AudienceSchema)
  .min(1)
  .optional()
  .describe('Show only in these views, e.g. ["developer"]. Leave out to show in every view.')

// ─── Profile ────────────────────────────────────────────────────────────────

/** One item in the contact line, e.g. an email, phone, city or profile link. */
export const ContactSchema = z.object({
  label: z.string().describe('What is shown, e.g. "name@example.com" or "[Phone]".'),
  href: z
    .string()
    .regex(/^(mailto:|tel:|https?:\/\/)/, 'Use a mailto:, tel: or http(s):// link')
    .optional()
    .describe('Makes the item a link. Leave out for plain text, such as a city.'),
})

/** What changes in the title block for one view. */
const ProfileViewSchema = z.object({
  role: z.string().optional(),
  summary: z.string().optional(),
})

export const ProfileSchema = z.object({
  name: z.string(),
  role: z.string(),
  summary: z.string().describe('Two or three sentences shown at the top of the CV.'),
  contact: z.array(ContactSchema).describe('The contact line under the name, in order.'),
  cvPdf: PublicPath.optional().describe('Downloadable PDF version of the CV.'),
  views: z
    .object({ developer: ProfileViewSchema.optional(), architect: ProfileViewSchema.optional() })
    .optional()
    .describe('Role and summary for one view. Anything left out uses the values above.'),
})

// ─── CV ─────────────────────────────────────────────────────────────────────

/** A percentage (0–100) of a figure's width or height. */
const Percent = z.number().min(0).max(100)

/**
 * How a sub-bullet sets up one figure. Only the fields that suit the figure's
 * type apply (checked by the content tests):
 * model: parts, drawing, azimuth, elevation, zoom · gallery: image ·
 * video: time, until · animation: marker · drawing/image: region ·
 * dynamo: region · code: lines.
 */
export const FigureViewSchema = z.object({
  figure: Id.describe('Id of the figure in figures.json.'),
  parts: z.array(Id).optional().describe('Model: building parts to highlight.'),
  drawing: Id.optional().describe('Model: drawing (from building.json) to show on the model.'),
  azimuth: z.number().optional().describe('Model: camera angle around the building, in degrees.'),
  elevation: z
    .number()
    .min(15)
    .max(60)
    .optional()
    .describe('Model: camera angle above the horizon, in degrees (15–60).'),
  zoom: z.number().positive().optional().describe('Model: zoom multiplier, e.g. 1.5.'),
  image: z.number().int().min(0).optional().describe('Gallery: index of the image to show.'),
  time: z.number().min(0).optional().describe('Video: start time in seconds.'),
  until: z.number().min(0).optional().describe('Video: pause at this time, in seconds.'),
  marker: z.string().optional().describe('Animation: Lottie marker name to play.'),
  region: z
    .tuple([Percent, Percent, Percent, Percent])
    .optional()
    .describe('Drawing/image/dynamo: zoom to [x, y, width, height] in % of the figure.'),
  lines: z
    .tuple([z.number().int().positive(), z.number().int().positive()])
    .optional()
    .describe('Code: highlight lines [from, to].'),
})

export const SubBulletSchema = z.object({
  id: Id.optional().describe('Needed only when something links to this sub-bullet.'),
  text: z.string(),
  figure: FigureViewSchema.optional().describe('The figure shown beside this line, and how.'),
})

export const BulletSchema = z.object({
  id: Id.optional().describe('Needed only when something links to this bullet.'),
  text: z.string(),
  for: For,
  figure: FigureViewSchema.optional().describe('The figure shown beside this line, and how.'),
  children: z
    .array(SubBulletSchema)
    .default([])
    .describe('Sub-bullets: finer points under this bullet, shown indented.'),
})

export const ExperienceSchema = z.object({
  id: Id,
  role: z.string(),
  company: z.string(),
  location: z.string().optional(),
  start: YearMonth,
  end: z.union([YearMonth, z.literal('present')]),
  descriptor: z.string().optional().describe('One-line summary of the role.'),
  for: For,
  bullets: z.array(BulletSchema),
})

export const EducationSchema = z.object({
  id: Id,
  degree: z.string(),
  school: z.string().optional(),
  location: z.string().optional(),
  start: YearMonth,
  end: z.union([YearMonth, z.literal('present')]),
  notes: z.string().optional(),
})

export const SkillGroupSchema = z.object({
  group: z.string().describe('E.g. "BIM", "Computational", "Visualisation".'),
  items: z.array(z.string()).describe('Software or skills, e.g. ["Revit", "Dynamo"].'),
  note: z.string().optional().describe('Shown in brackets after the items, e.g. "also C++, Lua".'),
  for: For,
})

export const CertificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  year: z.number().int(),
  url: z.url().optional(),
})

export const LanguageSchema = z.object({
  name: z.string(),
  level: z.string().describe('E.g. "Native", "Fluent", "B2".'),
})

export const ProjectSchema = z.object({
  id: Id.optional(),
  title: z.string().describe('Bold lead-in, e.g. "Home lab".'),
  text: z.string(),
  for: For,
})

export const CvSchema = z.object({
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema).default([]).describe('Personal projects.'),
  education: z.array(EducationSchema),
  skills: z.array(SkillGroupSchema),
  certifications: z.array(CertificationSchema).default([]),
  languages: z.array(LanguageSchema),
})

// ─── Building ───────────────────────────────────────────────────────────────

export const ImageSchema = z.object({
  src: PublicPath,
  alt: z.string().min(1, 'Describe the image for screen readers'),
  caption: z.string().optional(),
})

export const DynamoScriptSchema = z.object({
  id: Id,
  title: z.string(),
  description: z.string(),
  graphImage: ImageSchema.describe('Screenshot of the node graph, exported from Dynamo.'),
})

export const DrawingPlacementSchema = z.object({
  position: Vec3.describe('Centre of the drawing in model coordinates (metres, Y up).'),
  rotation: Vec3.default([0, 0, 0]).describe(
    'Rotation in degrees about X, Y, Z. [0,0,0] faces +Z (a vertical sheet); [-90,0,0] lies flat facing up (a plan).',
  ),
  width: z.number().positive().describe('Width of the drawing in metres.'),
  height: z.number().positive().describe('Height of the drawing in metres.'),
})

export const DrawingSchema = z.object({
  id: Id,
  title: z.string().describe('E.g. "Section A-A" or "Plan Level 02".'),
  kind: z.enum(['section', 'plan', 'elevation', 'detail']),
  src: PublicPath.describe(
    'SVG or PNG. Give SVGs width/height attributes so they rasterise sharply.',
  ),
  placement: DrawingPlacementSchema,
  clip: z
    .boolean()
    .default(false)
    .describe('Cut away the model in front of the drawing, like a section box.'),
})

export const BuildingPartSchema = z.object({
  id: Id,
  number: z.number().int().positive().describe('Label number shown on the model, like ① ② ③.'),
  name: z.string(),
  summary: z.string().describe('Shown as the tooltip of the part label on the model.'),
  meshNames: z
    .array(z.string())
    .min(1)
    .describe('glTF node names that make up this part. Must match names in the model file.'),
  labelPosition: Vec3.optional().describe(
    'Where the number label sits, in model coordinates (metres, Y up). Defaults to the centre of the part.',
  ),
  dynamoScripts: z.array(DynamoScriptSchema).default([]),
  drawings: z.array(DrawingSchema).default([]),
})

export const BuildingSchema = z.object({
  project: z.object({
    name: z.string(),
    location: z.string(),
    year: z.number().int(),
    role: z.string().describe('Your role on this project.'),
    description: z.string(),
  }),
  model: z.object({
    src: PublicPath.describe('The .glb file in public/models/.'),
  }),
  parts: z.array(BuildingPartSchema),
})

// ─── Figures ────────────────────────────────────────────────────────────────

export const CalloutSchema = z
  .object({
    number: z.number().int().positive().describe('The number printed in the marker.'),
    x: Percent.describe('Horizontal position, % from the left edge.'),
    y: Percent.describe('Vertical position, % from the top edge.'),
    target: z
      .object({ bullet: Id.optional(), figure: Id.optional(), part: Id.optional() })
      .describe('What the marker links to: a CV bullet, another figure, or a building part.'),
  })
  .refine(({ target }) => target.bullet ?? target.figure ?? target.part, {
    message: 'A callout needs a bullet, figure or part target',
  })

const FigureBase = z.object({
  id: Id,
  caption: z.string().describe('Shown under the figure after "Fig. N —".'),
  alt: z.string().min(1, 'Describe the figure for screen readers'),
})

export const FigureSchema = z.discriminatedUnion('type', [
  FigureBase.extend({
    type: z.literal('model').describe('The 3D building from building.json.'),
  }),
  FigureBase.extend({
    type: z.literal('drawing'),
    src: PublicPath.describe('Vector drawing (SVG).'),
    callouts: z.array(CalloutSchema).default([]),
  }),
  FigureBase.extend({
    type: z.literal('dynamo'),
    scriptId: Id.describe('Id of a Dynamo script listed under a part in building.json.'),
  }),
  FigureBase.extend({
    type: z.literal('image'),
    src: PublicPath,
  }),
  FigureBase.extend({
    type: z.literal('gallery'),
    images: z.array(ImageSchema).min(1),
    intervalMs: z.number().int().positive().default(4000).describe('Time per image when cycling.'),
  }),
  FigureBase.extend({
    type: z.literal('video'),
    src: PublicPath.optional().describe('Short MP4/WebM clip in public/, played muted on loop.'),
    poster: PublicPath.optional(),
    embed: z.url().optional().describe('YouTube or Vimeo URL for longer videos (loads on click).'),
  }),
  FigureBase.extend({
    type: z.literal('animation'),
    src: PublicPath.describe('Animated SVG, or a Lottie .json/.lottie file.'),
  }),
  FigureBase.extend({
    type: z.literal('code'),
    src: PublicPath.describe('Source file, e.g. a Dynamo Python node (.py).'),
    language: z.enum(['python', 'javascript', 'typescript', 'json']).default('python'),
  }),
])

export const FiguresSchema = z.object({
  figures: z.array(FigureSchema),
})

// ─── Inferred types ─────────────────────────────────────────────────────────

export type Profile = z.infer<typeof ProfileSchema>
export type Audience = z.infer<typeof AudienceSchema>
export type Contact = z.infer<typeof ContactSchema>
export type Cv = z.infer<typeof CvSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Bullet = z.infer<typeof BulletSchema>
export type Education = z.infer<typeof EducationSchema>
export type SkillGroup = z.infer<typeof SkillGroupSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Language = z.infer<typeof LanguageSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Building = z.infer<typeof BuildingSchema>
export type BuildingPart = z.infer<typeof BuildingPartSchema>
export type DynamoScript = z.infer<typeof DynamoScriptSchema>
export type Image = z.infer<typeof ImageSchema>
export type Drawing = z.infer<typeof DrawingSchema>
export type DrawingPlacement = z.infer<typeof DrawingPlacementSchema>
export type Figure = z.infer<typeof FigureSchema>
export type FigureType = Figure['type']
export type Callout = z.infer<typeof CalloutSchema>
export type FigureView = z.infer<typeof FigureViewSchema>
export type SubBullet = z.infer<typeof SubBulletSchema>
