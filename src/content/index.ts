import { z } from 'zod'
import buildingJson from './building.json'
import cvJson from './cv.json'
import figuresJson from './figures.json'
import profileJson from './profile.json'
import { BuildingSchema, CvSchema, FiguresSchema, ProfileSchema } from './schema'

/**
 * Validates a content file and throws a readable error naming the file and
 * the offending fields, so a typo in the JSON fails loudly in dev and CI.
 */
function parseContent<T extends z.ZodType>(file: string, schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(`Invalid content in src/content/${file}:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}

export const profile = parseContent('profile.json', ProfileSchema, profileJson)
export const cv = parseContent('cv.json', CvSchema, cvJson)
export const building = parseContent('building.json', BuildingSchema, buildingJson)
export const { figures } = parseContent('figures.json', FiguresSchema, figuresJson)
