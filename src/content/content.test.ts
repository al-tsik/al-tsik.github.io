import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { building, cv } from './index'
import { BuildingSchema, CvSchema, ProfileSchema } from './schema'

/** Returns the values that appear more than once. */
function duplicates(values: readonly (string | number)[]): (string | number)[] {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

describe('content integrity', () => {
  const partIds = building.parts.map((part) => part.id)

  it('has unique ids within each collection', () => {
    expect(duplicates(cv.experience.map((e) => e.id))).toEqual([])
    expect(duplicates(cv.education.map((e) => e.id))).toEqual([])
    expect(duplicates(partIds)).toEqual([])
    expect(duplicates(building.parts.flatMap((p) => p.dynamoScripts.map((s) => s.id)))).toEqual([])
  })

  it('has unique part label numbers', () => {
    expect(duplicates(building.parts.map((part) => part.number))).toEqual([])
  })

  it('assigns each model mesh to at most one part', () => {
    expect(duplicates(building.parts.flatMap((part) => part.meshNames))).toEqual([])
  })

  it('only links CV bullets to building parts that exist', () => {
    const unknown = cv.experience
      .flatMap((job) => job.bullets.flatMap((bullet) => bullet.partIds))
      .filter((id) => !partIds.includes(id))

    expect(unknown).toEqual([])
  })
})

describe('generated JSON schemas', () => {
  it.each([
    ['profile', ProfileSchema],
    ['cv', CvSchema],
    ['building', BuildingSchema],
  ] as const)('%s.schema.json is up to date (run `npm run content:schemas`)', (name, schema) => {
    const file = new URL(`./schemas/${name}.schema.json`, import.meta.url)
    const committed: unknown = JSON.parse(readFileSync(file, 'utf8'))

    expect(committed).toEqual(z.toJSONSchema(schema, { io: 'input' }))
  })
})
