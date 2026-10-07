import type { Bullet, Experience, Figure, FigureView, SubBullet } from '../content/schema'
import { figureRefIds } from './figureRefs'

// ─── Bullet keys ────────────────────────────────────────────────────────────

/** A bullet or sub-bullet, addressable by a stable key. */
export type BulletEntry = {
  key: string
  /** The main bullet (for a sub-bullet: its parent). */
  bullet: Bullet
  /** Set when this entry is a sub-bullet. */
  sub: SubBullet | null
  /** For sub-bullets, the parent bullet's key. */
  parentKey: string | null
}

/** A bullet's key: its id, or `<jobId>-<n>` (1-based) when it has none. */
export function bulletKey(jobId: string, bullet: Bullet, index: number): string {
  return bullet.id ?? `${jobId}-${index + 1}`
}

/** A sub-bullet's key: its id, or `<parentKey>-<n>` (1-based) when it has none. */
export function subBulletKey(parentKey: string, sub: SubBullet, index: number): string {
  return sub.id ?? `${parentKey}-${index + 1}`
}

/** Every bullet and sub-bullet keyed by bulletKey/subBulletKey. */
export function indexBullets(experience: readonly Experience[]): Map<string, BulletEntry> {
  const index = new Map<string, BulletEntry>()

  for (const job of experience) {
    job.bullets.forEach((bullet, i) => {
      const key = bulletKey(job.id, bullet, i)
      index.set(key, { key, bullet, sub: null, parentKey: null })

      bullet.children.forEach((sub, j) => {
        const subKey = subBulletKey(key, sub, j)
        index.set(subKey, { key: subKey, bullet, sub, parentKey: key })
      })
    })
  }
  return index
}

/**
 * The focus after clicking a bullet: clicking a new bullet focuses it;
 * clicking the focused one steps back (a sub-bullet to its parent, a main
 * bullet to nothing, i.e. the random figures).
 */
export function nextFocus(
  currentKey: string | null,
  clickedKey: string,
  index: ReadonlyMap<string, BulletEntry>,
): string | null {
  if (currentKey !== clickedKey) return clickedKey
  return index.get(clickedKey)?.parentKey ?? null
}

// ─── Line figures ───────────────────────────────────────────────────────────

/** A figure view resolved for display: models may highlight several parts. */
export type ResolvedView = Omit<FigureView, 'part'> & { parts?: string[] }

/** The one figure a line shows, anchored to that line. */
export type LineFigure = {
  /** Key of the line the figure sits beside. */
  key: string
  figureId: string
  view: ResolvedView
}

function resolveView({ part, parts, ...rest }: FigureView): ResolvedView {
  return { ...rest, parts: parts ?? (part ? [part] : undefined) }
}

/**
 * The figure a line shows. A sub-bullet without its own figure falls back to
 * its parent's, still anchored to the sub-bullet.
 */
export function figureForLine(entry: BulletEntry): LineFigure | null {
  const view = entry.sub ? (entry.sub.figure ?? entry.bullet.figure) : entry.bullet.figure
  return view ? { key: entry.key, figureId: view.figure, view: resolveView(view) } : null
}

/**
 * Lines shown before the visitor interacts: `count` random lines that have
 * figures, each with a different figure, starting with a model line when
 * there is one. `rng` returns [0, 1) like Math.random and is a parameter so
 * tests are deterministic.
 */
export function pickRandomLines(
  index: ReadonlyMap<string, BulletEntry>,
  figureTypes: ReadonlyMap<string, string>,
  rng: () => number,
  count = 3,
): string[] {
  const lines = [...index.values()].flatMap((entry) => {
    const line = entry.sub && !entry.sub.figure ? null : figureForLine(entry)
    return line ? [line] : []
  })

  // Shuffle (Fisher–Yates), then keep the first line per figure.
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[lines[i], lines[j]] = [lines[j], lines[i]]
  }
  const model = lines.find((line) => figureTypes.get(line.figureId) === 'model')
  const picked: LineFigure[] = model ? [model] : []
  for (const line of lines) {
    if (picked.length >= count) break
    if (!picked.some((other) => other.figureId === line.figureId)) picked.push(line)
  }
  return picked.map((line) => line.key)
}

// ─── Focus ──────────────────────────────────────────────────────────────────

export type FigureFocus = {
  /** Figures to show, in display order. */
  figureIds: string[]
  /** View per figure id; figures without an entry use their default view. */
  views: Record<string, ResolvedView>
}

/** Combines line figures into what the figure column shows. */
export function focusForLines(lines: readonly LineFigure[]): FigureFocus {
  return {
    figureIds: lines.map((line) => line.figureId),
    views: Object.fromEntries(lines.map((line) => [line.figureId, line.view])),
  }
}

// ─── Numbering ──────────────────────────────────────────────────────────────

/**
 * Figure numbers by first mention in the CV, like a paper: walks the CV in
 * reading order collecting text references and each line's figure.
 * Unmentioned figures follow in figures.json order.
 */
export function numberFigures(
  figures: readonly Figure[],
  experience: readonly Experience[],
): Map<string, number> {
  const known = new Set(figures.map((figure) => figure.id))
  const order: string[] = []
  const mention = (id: string | undefined) => {
    if (id && known.has(id) && !order.includes(id)) order.push(id)
  }

  for (const job of experience) {
    figureRefIds(job.descriptor).forEach(mention)
    for (const bullet of job.bullets) {
      figureRefIds(bullet.text).forEach(mention)
      mention(bullet.figure?.figure)
      for (const sub of bullet.children) {
        figureRefIds(sub.text).forEach(mention)
        mention(sub.figure?.figure)
      }
    }
  }
  figures.forEach((figure) => mention(figure.id))

  return new Map(order.map((id, i) => [id, i + 1]))
}

// ─── Links from figures back to the CV ──────────────────────────────────────

export type LinkTarget = { bullet?: string; figure?: string; part?: string }
export type ResolvedLink = { kind: 'bullet'; key: string } | { kind: 'figure'; id: string }

/**
 * Where a numbered marker (drawing callout or model label) leads: a bullet
 * (directly, or the first line whose figure highlights a part) or another
 * figure. Null when nothing matches.
 */
export function resolveLink(
  target: LinkTarget,
  index: ReadonlyMap<string, BulletEntry>,
): ResolvedLink | null {
  if (target.bullet && index.has(target.bullet)) return { kind: 'bullet', key: target.bullet }
  if (target.part) {
    for (const entry of index.values()) {
      const line = figureForLine(entry)
      if (line?.view.parts?.includes(target.part)) return { kind: 'bullet', key: entry.key }
    }
  }
  if (target.figure) return { kind: 'figure', id: target.figure }
  return null
}
