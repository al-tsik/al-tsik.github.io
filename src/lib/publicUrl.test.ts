import { describe, expect, it } from 'vitest'
import { publicUrl, withBase } from './publicUrl'

describe('withBase', () => {
  it('leaves paths unchanged at the domain root', () => {
    expect(withBase('/models/x.glb', '/')).toBe('/models/x.glb')
  })

  it('prefixes a sub-path, with or without a trailing slash', () => {
    expect(withBase('/models/x.glb', '/altsik.github.io/')).toBe('/altsik.github.io/models/x.glb')
    expect(withBase('/models/x.glb', '/altsik.github.io')).toBe('/altsik.github.io/models/x.glb')
  })
})

describe('publicUrl', () => {
  it("uses Vite's base URL (root in tests)", () => {
    expect(publicUrl('/cv.pdf')).toBe('/cv.pdf')
  })
})
