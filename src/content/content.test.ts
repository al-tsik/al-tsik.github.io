import { NodeIO } from '@gltf-transform/core'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { building, cv, figures, profile } from './index'
import { BuildingSchema, CvSchema, FiguresSchema, ProfileSchema, type Figure } from './schema'

/** Resolves a public path like "/models/x.glb" to a file on disk. */
function publicFile(path: string): string {
  return fileURLToPath(new URL(`../../public${path}`, import.meta.url))
}

/** Returns the values that appear more than once. */
function duplicates(values: readonly (string | number)[]): (string | number)[] {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

/** Every public file a figure references. */
function figureFiles(figure: Figure): (string | undefined)[] {
  switch (figure.type) {
    case 'drawing':
    case 'image':
    case 'animation':
      return [figure.src]
    case 'gallery':
      return figure.images.map((image) => image.src)
    case 'video':
      return [figure.src, figure.poster]
    default:
      return []
  }
}

const bulletIds = cv.experience.flatMap((job) =>
  job.bullets.flatMap((bullet) => [bullet.id, ...bullet.children.map((child) => child.id)]),
)

describe('content integrity', () => {
  const partIds = building.parts.map((part) => part.id)

  it('has unique ids within each collection', () => {
    expect(duplicates(cv.experience.map((e) => e.id))).toEqual([])
    expect(duplicates(cv.education.map((e) => e.id))).toEqual([])
    expect(duplicates(partIds)).toEqual([])
    expect(duplicates(building.parts.flatMap((p) => p.dynamoScripts.map((s) => s.id)))).toEqual([])
    expect(duplicates(building.parts.flatMap((p) => p.drawings.map((d) => d.id)))).toEqual([])
  })

  it('has unique bullet and sub-bullet ids', () => {
    expect(duplicates(bulletIds.filter((id) => id !== undefined))).toEqual([])
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

describe('figures', () => {
  const figureIds = figures.map((figure) => figure.id)

  it('have unique ids', () => {
    expect(duplicates(figureIds)).toEqual([])
  })

  it('reference Dynamo scripts that exist', () => {
    const scriptIds = building.parts.flatMap((part) => part.dynamoScripts.map((s) => s.id))
    const unknown = figures.flatMap((figure) =>
      figure.type === 'dynamo' && !scriptIds.includes(figure.scriptId) ? [figure.scriptId] : [],
    )
    expect(unknown).toEqual([])
  })

  it('videos have a file or an embed', () => {
    const empty = figures.filter((f) => f.type === 'video' && !f.src && !f.embed)
    expect(empty.map((figure) => figure.id)).toEqual([])
  })

  it('callouts link to bullets, figures and parts that exist', () => {
    const broken = figures.flatMap((figure) =>
      figure.type !== 'drawing'
        ? []
        : figure.callouts
            .filter(
              ({ target }) =>
                (target.bullet && !bulletIds.includes(target.bullet)) ||
                (target.figure && !figureIds.includes(target.figure)) ||
                (target.part && !building.parts.some((part) => part.id === target.part)),
            )
            .map((callout) => `${figure.id} #${callout.number}`),
    )
    expect(broken).toEqual([])
  })

  it('have unique callout numbers per drawing', () => {
    for (const figure of figures) {
      if (figure.type === 'drawing') {
        expect(duplicates(figure.callouts.map((callout) => callout.number))).toEqual([])
      }
    }
  })
})

describe('referenced files', () => {
  it('exist in public/', () => {
    const paths = [
      profile.cvPdf,
      building.model.src,
      ...building.parts.flatMap((part) => [
        ...part.images.map((image) => image.src),
        ...part.drawings.map((drawing) => drawing.src),
        ...part.dynamoScripts.flatMap((script) => [script.graphImage.src, script.pythonFile]),
      ]),
      ...figures.flatMap(figureFiles),
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
    ['figures', FiguresSchema],
  ] as const)('%s.schema.json is up to date (run `npm run content:schemas`)', (name, schema) => {
    const file = new URL(`./schemas/${name}.schema.json`, import.meta.url)
    const committed: unknown = JSON.parse(readFileSync(file, 'utf8'))

    expect(committed).toEqual(z.toJSONSchema(schema, { io: 'input' }))
  })
})
