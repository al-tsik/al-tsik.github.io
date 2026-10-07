/// <reference types="vite/client" />

/**
 * Joins a public-folder path ("/models/x.glb") onto the site's base path,
 * e.g. "/altsik.github.io/" → "/altsik.github.io/models/x.glb".
 */
export function withBase(path: string, base: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}${path.replace(/^\/+/, '')}`
}

/**
 * Resolves a path in public/ against Vite's base URL, so the site works both
 * at a domain root and under a sub-path (a GitHub Pages project site).
 * Falls back to "/" outside Vite (e.g. Node scripts).
 */
export function publicUrl(path: string): string {
  return withBase(path, import.meta.env?.BASE_URL ?? '/')
}
