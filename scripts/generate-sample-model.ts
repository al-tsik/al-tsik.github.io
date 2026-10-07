/**
 * Generates public/models/sample-building.glb: a simple 4-storey massing model
 * made of boxes, with one named glTF node per building element. Node names
 * match the `meshNames` in src/content/building.json, the same way a real
 * Revit/IFC export would be wired up.
 *
 * Run:  npm run model:sample
 *
 * Units are metres, Y is up (glTF convention), and the model is centred on
 * the origin at ground level.
 */
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Document, NodeIO } from '@gltf-transform/core'

type Vec3 = [number, number, number]

/** An axis-aligned box from its minimum and maximum corners. */
type Box = { min: Vec3; max: Vec3 }

// ─── Building dimensions ────────────────────────────────────────────────────

const WIDTH = 18 // along X
const DEPTH = 12 // along Z
const STOREY = 3.5
const STOREYS = 4
const ROOF_LEVEL = STOREY * STOREYS // 14 m
const SLAB = 0.3

const halfW = WIDTH / 2
const halfD = DEPTH / 2

// ─── Geometry helpers ───────────────────────────────────────────────────────

/** Six faces per box, each with its own normal so edges render crisp. */
const FACES: { normal: Vec3; corners: (b: Box) => Vec3[] }[] = [
  {
    normal: [1, 0, 0],
    corners: ({ min, max }) => [
      [max[0], min[1], max[2]],
      [max[0], min[1], min[2]],
      [max[0], max[1], min[2]],
      [max[0], max[1], max[2]],
    ],
  },
  {
    normal: [-1, 0, 0],
    corners: ({ min, max }) => [
      [min[0], min[1], min[2]],
      [min[0], min[1], max[2]],
      [min[0], max[1], max[2]],
      [min[0], max[1], min[2]],
    ],
  },
  {
    normal: [0, 1, 0],
    corners: ({ min, max }) => [
      [min[0], max[1], max[2]],
      [max[0], max[1], max[2]],
      [max[0], max[1], min[2]],
      [min[0], max[1], min[2]],
    ],
  },
  {
    normal: [0, -1, 0],
    corners: ({ min, max }) => [
      [min[0], min[1], min[2]],
      [max[0], min[1], min[2]],
      [max[0], min[1], max[2]],
      [min[0], min[1], max[2]],
    ],
  },
  {
    normal: [0, 0, 1],
    corners: ({ min, max }) => [
      [min[0], min[1], max[2]],
      [max[0], min[1], max[2]],
      [max[0], max[1], max[2]],
      [min[0], max[1], max[2]],
    ],
  },
  {
    normal: [0, 0, -1],
    corners: ({ min, max }) => [
      [max[0], min[1], min[2]],
      [min[0], min[1], min[2]],
      [min[0], max[1], min[2]],
      [max[0], max[1], min[2]],
    ],
  },
]

/** Merges boxes into flat position/normal/index arrays for one primitive. */
function boxesToArrays(boxes: Box[]) {
  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []

  for (const box of boxes) {
    for (const face of FACES) {
      const start = positions.length / 3
      for (const corner of face.corners(box)) {
        positions.push(...corner)
        normals.push(...face.normal)
      }
      indices.push(start, start + 1, start + 2, start, start + 2, start + 3)
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint32Array(indices),
  }
}

/** Repeats vertical fins along one facade, leaving gaps to see inside. */
function finsAlong(axis: 'x' | 'z', fixed: number, length: number, spacing: number): Box[] {
  const fins: Box[] = []
  const count = Math.floor(length / spacing)
  const finWidth = 0.25
  const finDepth = 0.2

  for (let i = 0; i <= count; i++) {
    const t = -length / 2 + i * (length / count)
    const [a0, a1] = [t - finWidth / 2, t + finWidth / 2]
    const [f0, f1] = [fixed - finDepth / 2, fixed + finDepth / 2]
    fins.push(
      axis === 'x'
        ? { min: [a0, 0, f0], max: [a1, ROOF_LEVEL, f1] }
        : { min: [f0, 0, a0], max: [f1, ROOF_LEVEL, a1] },
    )
  }
  return fins
}

// ─── Building elements: node name → boxes ──────────────────────────────────

const slabAt = (level: number): Box => ({
  min: [-halfW, level - SLAB, -halfD],
  max: [halfW, level, halfD],
})

const parapetHeight = 1
const parapet = 0.2

const elements: Record<string, Box[]> = {
  foundation: [{ min: [-halfW - 0.5, -0.8, -halfD - 0.5], max: [halfW + 0.5, 0, halfD + 0.5] }],
  'level-01': [slabAt(STOREY * 1)],
  'level-02': [slabAt(STOREY * 2)],
  'level-03': [slabAt(STOREY * 3)],
  core: [{ min: [-2, 0, -halfD + 1], max: [2, ROOF_LEVEL + 1.5, -halfD + 6] }],
  'facade-n': finsAlong('x', -halfD - 0.3, WIDTH, 1.5),
  'facade-s': finsAlong('x', halfD + 0.3, WIDTH, 1.5),
  'facade-e': finsAlong('z', halfW + 0.3, DEPTH, 1.5),
  'facade-w': finsAlong('z', -halfW - 0.3, DEPTH, 1.5),
  roof: [
    slabAt(ROOF_LEVEL),
    {
      min: [-halfW, ROOF_LEVEL, -halfD],
      max: [halfW, ROOF_LEVEL + parapetHeight, -halfD + parapet],
    },
    { min: [-halfW, ROOF_LEVEL, halfD - parapet], max: [halfW, ROOF_LEVEL + parapetHeight, halfD] },
    {
      min: [-halfW, ROOF_LEVEL, -halfD],
      max: [-halfW + parapet, ROOF_LEVEL + parapetHeight, halfD],
    },
    { min: [halfW - parapet, ROOF_LEVEL, -halfD], max: [halfW, ROOF_LEVEL + parapetHeight, halfD] },
  ],
}

// ─── Build the glTF document ───────────────────────────────────────────────

const doc = new Document()
const buffer = doc.createBuffer()
const material = doc.createMaterial('white').setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(1)
const scene = doc.createScene('building')

for (const [name, boxes] of Object.entries(elements)) {
  const { positions, normals, indices } = boxesToArrays(boxes)

  const primitive = doc
    .createPrimitive()
    .setMaterial(material)
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(positions).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc.createAccessor().setType('VEC3').setArray(normals).setBuffer(buffer),
    )
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(indices).setBuffer(buffer))

  const mesh = doc.createMesh(name).addPrimitive(primitive)
  scene.addChild(doc.createNode(name).setMesh(mesh))
}

const outDir = new URL('../public/models/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const outFile = fileURLToPath(new URL('sample-building.glb', outDir))
await new NodeIO().write(outFile, doc)
console.log(`wrote public/models/sample-building.glb (${Object.keys(elements).length} nodes)`)
