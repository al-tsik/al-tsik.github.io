import { NodeIO } from '@gltf-transform/core'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { building, cv, profile } from './index'
import { BuildingSchema, CvSchema, ProfileSchema } from './schema'

/** Resolves a public path like "/models/x.glb" to a file on disk. */
function publicFile(path: string): string {
  return fileURLToPath(new URL(`../../public${path}`, import.meta.url))
}

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

describe('referenced files', () => {
  it('exist in public/', () => {
    const paths = [
      profile.cvPdf,
      building.model.src,
      ...building.parts.flatMap((part) => [
        ...part.images.map((image) => image.src),
        ...part.dynamoScripts.flatMap((script) => [script.graphImage.src, script.pythonFile]),
      ]),
    ].filter((path): path is string => path !== undefined)

    const missing = paths.filter((path) => !existsSync(publicFile(path)))

    expect(missing).toEqual([])
  })

  it('every meshName is a node in the building model', async () => {
    const model = await new NodeIO().read(publicFile(building.model.src))
    const nodeNames = new Set(
      model
        .getRoot()
        .listNodes()
        .map((node) => node.getName()),
    )

    const unknown = building.parts
      .flatMap((part) => part.meshNames)
      .filter((name) => !nodeNames.has(name))

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
