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

// ─── Initial figures ────────────────────────────────────────────────────────

/**
 * Figures shown before the visitor clicks anything: the model (if any)
 * plus random others, `count` in total. `rng` returns [0, 1) like
 * Math.random and is a parameter so tests are deterministic.
 */
export function pickInitialFigures(
  figures: readonly Figure[],
  rng: () => number,
  count = 3,
): string[] {
  const model = figures.find((figure) => figure.type === 'model')
  const others = figures.filter((figure) => figure !== model).map((figure) => figure.id)

  // Partial Fisher–Yates shuffle: only as many swaps as picks needed.
  const picks = count - (model ? 1 : 0)
  for (let i = 0; i < Math.min(picks, others.length); i++) {
    const j = i + Math.floor(rng() * (others.length - i))
    ;[others[i], others[j]] = [others[j], others[i]]
  }

  return [...(model ? [model.id] : []), ...others.slice(0, Math.max(picks, 0))]
}

// ─── Focus ──────────────────────────────────────────────────────────────────

/** A figure view after resolving bullet context: models may highlight several parts. */
export type ResolvedView = Omit<FigureView, 'part'> & { parts?: string[] }

export type FigureFocus = {
  /** Figures to show, in display order. */
  figureIds: string[]
  /** View per figure id; figures without an entry use their default view. */
  views: Record<string, ResolvedView>
}

/** What the figure column shows while a bullet or sub-bullet is focused. */
export function focusForBullet(entry: BulletEntry, modelFigureId: string | null): FigureFocus {
  const { bullet, sub } = entry
  const showModel = modelFigureId !== null && bullet.partIds.length > 0
  const views: Record<string, ResolvedView> = {}

  if (showModel) {
    views[modelFigureId] = { figure: modelFigureId, parts: bullet.partIds }
  }

  // Listed figures, then figures the text cross-references ({fig:id}).
  const figureIds = [
    ...(showModel ? [modelFigureId] : []),
    ...bullet.figures,
    ...figureRefIds(bullet.text),
    ...(sub ? figureRefIds(sub.text) : []),
  ]

  for (const view of sub?.views ?? []) {
    const { part, ...rest } = view
    const parentParts = views[view.figure]?.parts
    views[view.figure] = { ...rest, parts: part ? [part] : parentParts }
    if (!figureIds.includes(view.figure)) figureIds.push(view.figure)
  }

  return { figureIds: [...new Set(figureIds)], views }
}

// ─── Numbering ──────────────────────────────────────────────────────────────

/**
 * Figure numbers by first mention in the CV, like a paper: walks the CV in
 * reading order collecting text references, bullet figures, the model (for
 * bullets with parts) and sub-bullet views. Unmentioned figures follow in
 * figures.json order.
 */
export function numberFigures(
  figures: readonly Figure[],
  experience: readonly Experience[],
): Map<string, number> {
  const modelId = figures.find((figure) => figure.type === 'model')?.id
  const known = new Set(figures.map((figure) => figure.id))
  const order: string[] = []
  const mention = (id: string | undefined) => {
    if (id && known.has(id) && !order.includes(id)) order.push(id)
  }

  for (const job of experience) {
    figureRefIds(job.descriptor).forEach(mention)
    for (const bullet of job.bullets) {
      figureRefIds(bullet.text).forEach(mention)
      if (bullet.partIds.length > 0) mention(modelId)
      bullet.figures.forEach(mention)
      for (const sub of bullet.children) {
        figureRefIds(sub.text).forEach(mention)
        sub.views.forEach((view) => mention(view.figure))
      }
    }
  }
  figures.forEach((figure) => mention(figure.id))

  return new Map(order.map((id, i) => [id, i + 1]))
}
