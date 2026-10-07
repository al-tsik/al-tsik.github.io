/**
 * Generates JSON Schema files from the zod content schemas so editors
 * (VS Code etc.) can autocomplete and validate src/content/*.json.
 *
 * Run after changing src/content/schema.ts:  npm run content:schemas
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { z } from 'zod'
import { BuildingSchema, CvSchema, FiguresSchema, ProfileSchema } from '../src/content/schema.ts'

const outDir = new URL('../src/content/schemas/', import.meta.url)

const schemas = {
  profile: ProfileSchema,
  cv: CvSchema,
  building: BuildingSchema,
  figures: FiguresSchema,
}

mkdirSync(outDir, { recursive: true })

for (const [name, schema] of Object.entries(schemas)) {
  // io: 'input' describes what you write (fields with defaults are optional).
  const jsonSchema = z.toJSONSchema(schema, { io: 'input' })
  const file = new URL(`${name}.schema.json`, outDir)
  writeFileSync(file, JSON.stringify(jsonSchema, null, 2) + '\n')
  console.log(`wrote src/content/schemas/${name}.schema.json`)
}
