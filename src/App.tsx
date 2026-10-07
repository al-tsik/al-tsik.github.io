import { SiteFooter } from './components/layout/SiteFooter'
import { PaperLayout } from './components/layout/PaperLayout'
import { SiteHeader } from './components/layout/SiteHeader'
import { building, cv, figures, profile } from './content'
import {
  bulletFigureNumbers,
  bulletIndex,
  figureById,
  figureNumbers,
  modelFigureId,
} from './content/derived'
import { CertificationsList } from './features/cv/CertificationsList'
import { EducationList } from './features/cv/EducationList'
import { ExperienceTimeline } from './features/cv/ExperienceTimeline'
import { LanguagesList } from './features/cv/LanguagesList'
import { ProfileHero } from './features/cv/ProfileHero'
import { SkillsList } from './features/cv/SkillsList'
import { FigureColumn } from './features/figures/FigureColumn'
import { FigureOverlay } from './features/figures/FigureOverlay'
import { useFigureFocus } from './features/figures/useFigureFocus'
import { Outline } from './features/outline/Outline'
import { OutlineMenu } from './features/outline/OutlineMenu'
import { useEscapeToDeselect } from './hooks/useEscapeToDeselect'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useUrlStateSync } from './hooks/useUrlStateSync'
import { nextFocus, resolveLink, type FigureFocus, type LinkTarget } from './lib/figureVisibility'
import { useSelectionStore } from './state/selectionStore'

// Module-level so the functions are stable across renders.
const isBullet = (key: string) => bulletIndex.has(key)
const isFigure = (id: string) => figureById.has(id)

function App() {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const focusBullet = useSelectionStore((state) => state.focusBullet)
  const openFigure = useSelectionStore((state) => state.openFigure)
  const openFigureId = useSelectionStore((state) => state.openFigureId)
  const figureFocus = useFigureFocus(figures, bulletIndex, modelFigureId)
  useUrlStateSync(isBullet, isFigure)
  useEscapeToDeselect()
  // Matches Tailwind's `lg`, where the figure column sits beside the paper.
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const focusedMainKey = focusedKey ? (bulletIndex.get(focusedKey)?.parentKey ?? focusedKey) : null
  const onBulletFocus = (key: string) => focusBullet(nextFocus(focusedKey, key, bulletIndex))

  // A numbered marker on a figure leads to a bullet (focus it and bring it
  // into view, closing the overlay) or to another figure (open it).
  const followLink = (target: LinkTarget) => {
    const link = resolveLink(target, bulletIndex)
    if (link?.kind === 'figure') return openFigure(link.id)
    if (link?.kind !== 'bullet') return

    openFigure(null)
    focusBullet(link.key)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(`bullet-${link.key}`)
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  }

  const renderFigures = (focus: FigureFocus, inline = false) => (
    <FigureColumn
      focus={focus}
      figureById={figureById}
      numbers={figureNumbers}
      building={building}
      onOpen={openFigure}
      onLink={followLink}
      inline={inline}
    />
  )

  // Desktop: everything in the side column. Mobile: the model as a hero until
  // a bullet is focused, then that bullet's figures inline under it. Only one
  // copy is ever mounted (no hidden duplicate canvases or videos).
  const columnFigures = isDesktop
    ? renderFigures(figureFocus)
    : focusedMainKey === null
      ? renderFigures({ ...figureFocus, figureIds: figureFocus.figureIds.slice(0, 1) })
      : undefined
  const inlineFigures = isDesktop ? undefined : renderFigures(figureFocus, true)

  return (
    <div id="top">
      <SiteHeader name={profile.name} role={profile.role} />
      <PaperLayout figures={columnFigures} outline={<Outline experience={cv.experience} />}>
        <OutlineMenu experience={cv.experience} />
        <main id="cv" className="py-10">
          <ProfileHero profile={profile} />
          <ExperienceTimeline
            experience={cv.experience}
            bulletFigureNumbers={bulletFigureNumbers}
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
        focus={figureFocus}
        building={building}
        onClose={() => openFigure(null)}
        onLink={followLink}
      />
    </div>
  )
}

export default App
