import { z } from 'zod'

/*
 * Content schemas: the single source of truth for the shape of everything in
 * src/content/*.json. TypeScript types are inferred from these, and JSON Schema
 * files for editor autocomplete are generated from them.
 */

/** Lowercase kebab-case identifier, e.g. "roof" or "level-01". */
const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase kebab-case, e.g. "level-01"')

/** "YYYY-MM", e.g. "2023-09". */
const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM, e.g. "2023-09"')

/** Path to a file served from public/, e.g. "/images/roof.jpg". */
const PublicPath = z.string().startsWith('/', 'Paths are relative to public/ and start with "/"')

// ─── Profile ────────────────────────────────────────────────────────────────

export const LinkSchema = z.object({
  label: z.string(),
  url: z.url(),
})

export const ProfileSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  summary: z.string().describe('Two or three sentences shown at the top of the CV.'),
  email: z.email(),
  links: z.array(LinkSchema),
  cvPdf: PublicPath.optional().describe('Downloadable PDF version of the CV.'),
})

// ─── CV ─────────────────────────────────────────────────────────────────────

export const BulletSchema = z.object({
  text: z.string(),
  partIds: z
    .array(Id)
    .default([])
    .describe('Building part ids this bullet relates to. Selecting a part highlights it.'),
})

export const ExperienceSchema = z.object({
  id: Id,
  role: z.string(),
  company: z.string(),
  location: z.string(),
  start: YearMonth,
  end: z.union([YearMonth, z.literal('present')]),
  descriptor: z.string().describe('One-line summary of the role.'),
  bullets: z.array(BulletSchema),
})

export const EducationSchema = z.object({
  id: Id,
  degree: z.string(),
  school: z.string(),
  location: z.string(),
  start: YearMonth,
  end: z.union([YearMonth, z.literal('present')]),
  notes: z.string().optional(),
})

export const SkillGroupSchema = z.object({
  group: z.string().describe('E.g. "BIM", "Computational", "Visualisation".'),
  items: z.array(z.string()).describe('Software or skills, e.g. ["Revit", "Dynamo"].'),
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

export const CvSchema = z.object({
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillGroupSchema),
  certifications: z.array(CertificationSchema),
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
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  dynFile: PublicPath.describe('The .dyn graph, offered as a download.'),
  pythonFile: PublicPath.optional().describe('Python node source shown as a code preview.'),
  dynamoVersion: z.string().optional(),
})

export const BuildingPartSchema = z.object({
  id: Id,
  number: z.number().int().positive().describe('Label number shown on the model, like ① ② ③.'),
  name: z.string(),
  summary: z.string(),
  meshNames: z
    .array(z.string())
    .min(1)
    .describe('glTF node names that make up this part. Must match names in the model file.'),
  dynamoScripts: z.array(DynamoScriptSchema).default([]),
  images: z.array(ImageSchema).default([]),
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

// ─── Inferred types ─────────────────────────────────────────────────────────

export type Profile = z.infer<typeof ProfileSchema>
export type Cv = z.infer<typeof CvSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Bullet = z.infer<typeof BulletSchema>
export type Education = z.infer<typeof EducationSchema>
export type SkillGroup = z.infer<typeof SkillGroupSchema>
export type Building = z.infer<typeof BuildingSchema>
export type BuildingPart = z.infer<typeof BuildingPartSchema>
export type DynamoScript = z.infer<typeof DynamoScriptSchema>
export type Image = z.infer<typeof ImageSchema>
