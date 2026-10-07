import { SiteFooter } from './components/layout/SiteFooter'
import { PaperLayout } from './components/layout/PaperLayout'
import { SiteHeader } from './components/layout/SiteHeader'
import { building, cv, profile } from './content'
import {
  bulletIndex,
  figureById,
  figureNumbers,
  figureTypes,
  lineFigureNumbers,
} from './content/derived'
import { CertificationsList } from './features/cv/CertificationsList'
import { EducationList } from './features/cv/EducationList'
import { ExperienceTimeline } from './features/cv/ExperienceTimeline'
import { LanguagesList } from './features/cv/LanguagesList'
import { ProfileHero } from './features/cv/ProfileHero'
import { SkillsList } from './features/cv/SkillsList'
import { FigureColumn } from './features/figures/FigureColumn'
import { FigureOverlay } from './features/figures/FigureOverlay'
import { scrollToLine } from './features/cv/scrollToLine'
import { useDisplayedLines } from './features/figures/useDisplayedLines'
import { Outline } from './features/outline/Outline'
import { OutlineMenu } from './features/outline/OutlineMenu'
import { useEscapeToOverview } from './hooks/useEscapeToOverview'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useUrlStateSync } from './hooks/useUrlStateSync'
import {
  figureForLine,
  nextFocus,
  resolveLink,
  type LineFigure,
  type LinkTarget,
} from './lib/figureVisibility'
import { useSelectionStore } from './state/selectionStore'

// Module-level so the functions are stable across renders.
const isBullet = (key: string) => bulletIndex.has(key)
const isFigure = (id: string) => figureById.has(id)

function App() {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const focusBullet = useSelectionStore((state) => state.focusBullet)
  const openFigure = useSelectionStore((state) => state.openFigure)
  const openFigureId = useSelectionStore((state) => state.openFigureId)
  const displayedLines = useDisplayedLines(bulletIndex, figureTypes)
  useUrlStateSync(isBullet, isFigure)
  useEscapeToOverview()
  // Matches Tailwind's `lg`, where the figure column sits beside the paper.
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const focusedMainKey = focusedKey ? (bulletIndex.get(focusedKey)?.parentKey ?? focusedKey) : null
  // Clicking a line pins its figure and brings the line to the reading position.
  const onBulletFocus = (key: string) => {
    const next = nextFocus(focusedKey, key, bulletIndex)
    focusBullet(next)
    // Next frame: pinning can change the layout above the line (e.g. the
    // mobile hero figure goes away), so measure after React has re-rendered.
    if (next) requestAnimationFrame(() => scrollToLine(next))
  }

  // A numbered marker on a figure leads to a bullet (focus it and bring it
  // into view, closing the overlay) or to another figure (open it).
  const followLink = (target: LinkTarget) => {
    const link = resolveLink(target, bulletIndex)
    if (link?.kind === 'figure') return openFigure(link.id)
    if (link?.kind !== 'bullet') return

    openFigure(null)
    focusBullet(link.key)
    scrollToLine(link.key)
  }

  const renderFigures = (lines: LineFigure[], inline = false) => (
    <FigureColumn
      lines={lines}
      figureById={figureById}
      numbers={figureNumbers}
      building={building}
      onOpen={openFigure}
      onLink={followLink}
      inline={inline}
    />
  )

  // Desktop: figures in the margin beside their lines. Mobile: one figure as a
  // hero until a line is pinned, then that line's figure inline under it. Only
  // one copy is ever mounted (no hidden duplicate canvases or videos).
  const columnFigures = isDesktop
    ? renderFigures(displayedLines)
    : focusedMainKey === null
      ? renderFigures(displayedLines.slice(0, 1))
      : undefined
  // Mobile has no hover: only the pinned line's figure, right under that line.
  const focusedEntry = focusedKey ? bulletIndex.get(focusedKey) : undefined
  const pinnedLine = focusedEntry ? figureForLine(focusedEntry) : null
  const inlineFigures = isDesktop || !pinnedLine ? undefined : renderFigures([pinnedLine], true)

  return (
    <div id="top">
      <SiteHeader name={profile.name} role={profile.role} />
      <PaperLayout figures={columnFigures} outline={<Outline experience={cv.experience} />}>
        <OutlineMenu experience={cv.experience} />
        <main id="cv" className="py-10">
          <ProfileHero profile={profile} />
          <ExperienceTimeline
            experience={cv.experience}
            lineFigureNumbers={lineFigureNumbers}
            figureNumbers={figureNumbers}
            onFigureOpen={openFigure}
            focusedKey={focusedKey}
            focusedMainKey={focusedMainKey}
            onBulletFocus={onBulletFocus}
            inlineFigures={inlineFigures}
          />
          <SkillsList skills={cv.skills} />
          <EducationList education={cv.education} />
          <CertificationsList certifications={cv.certifications} />
          <LanguagesList languages={cv.languages} />
        </main>
        <SiteFooter name={profile.name} />
      </PaperLayout>
      <FigureOverlay
        figure={(openFigureId && figureById.get(openFigureId)) || null}
        number={(openFigureId && figureNumbers.get(openFigureId)) || 0}
        view={displayedLines.find((line) => line.figureId === openFigureId)?.view}
        building={building}
        onClose={() => openFigure(null)}
        onLink={followLink}
      />
    </div>
  )
}

export default App
