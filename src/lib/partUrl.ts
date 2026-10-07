const PARAM = 'part'

/**
 * Reads the selected part from a query string like "?part=roof".
 * Unknown ids are ignored so stale or mistyped links open the overview.
 */
export function readPartFromSearch(search: string, validIds: readonly string[]): string | null {
  const partId = new URLSearchParams(search).get(PARAM)
  return partId && validIds.includes(partId) ? partId : null
}

/** Returns the query string with the part set or removed, keeping other params. */
export function writePartToSearch(search: string, partId: string | null): string {
  const params = new URLSearchParams(search)
  if (partId) params.set(PARAM, partId)
  else params.delete(PARAM)

  const query = params.toString()
  return query ? `?${query}` : ''
}
