import { describe, expect, it } from 'vitest'
import { readPartFromSearch, writePartToSearch } from './partUrl'

const ids = ['roof', 'core']

describe('readPartFromSearch', () => {
  it('reads a known part id', () => {
    expect(readPartFromSearch('?part=roof', ids)).toBe('roof')
  })

  it('ignores unknown or missing ids', () => {
    expect(readPartFromSearch('?part=attic', ids)).toBeNull()
    expect(readPartFromSearch('', ids)).toBeNull()
  })
})

describe('writePartToSearch', () => {
  it('sets the part', () => {
    expect(writePartToSearch('', 'roof')).toBe('?part=roof')
  })

  it('replaces an existing part and keeps other params', () => {
    expect(writePartToSearch('?utm=cv&part=core', 'roof')).toBe('?utm=cv&part=roof')
  })

  it('removes the part on deselect', () => {
    expect(writePartToSearch('?part=roof', null)).toBe('')
    expect(writePartToSearch('?utm=cv&part=roof', null)).toBe('?utm=cv')
  })
})
