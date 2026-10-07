import type { ReactNode } from 'react'
import { SiteFooter } from './components/layout/SiteFooter'
import { PaperLayout } from './components/layout/PaperLayout'
import { building, profile } from './content'
import { contentByView, figureById, figureTypes } from './content/derived'
import { CertificationsList } from './features/cv/CertificationsList'
import { CvSection } from './features/cv/CvSection'
import { CvViewToggle } from './features/cv/CvViewToggle'
import type { CvSectionId } from './features/cv/cvSections'
import { EducationList } from './features/cv/EducationList'
import { ExperienceTimeline } from './features/cv/ExperienceTimeline'
import { LanguagesList } from './features/cv/LanguagesList'
import { ProfileHero } from './features/cv/ProfileHero'
import { ProjectsList } from './features/cv/ProjectsList'
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
import { profileFor, type CvView } from './lib/cvView'
import {
  figureForLine,
  nextFocus,
  resolveLink,
  type LineFigure,
  type LinkTarget,
} from './lib/figureVisibility'
import { useSelectionStore } from './state/selectionStore'

// Module-level so the functions are stable across renders.
const isBullet = (key: string, view: CvView) => contentByView[view].bulletIndex.has(key)
const isFigure = (id: string) => figureById.has(id)

function App() {
  const cvView = useSelectionStore((state) => state.cvView)
  const setCvView = useSelectionStore((state) => state.setCvView)
  // The CV and its lookups as read in the current view.
  const { cv, sections, bulletIndex, figureNumbers, lineFigureNumbers } = contentByView[cvView]
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const focusBullet = useSelectionStore((state) => state.focusBullet)
  const openFigure = useSelectionStore((state) => state.openFigure)
  const openFigureId = useSelectionStore((state) => state.openFigureId)
  const displayedLines = useDisplayedLines(bulletIndex, figureTypes)
  useUrlStateSync(isBullet, isFigure)
  useEscapeToOverview()
  // Matches Tailwind's `lg`, where the figure column sits beside the paper.
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Switching views unpins a line the new view doesn't show.
  const changeView = (view: CvView) => {
    setCvView(view)
    if (focusedKey && !contentByView[view].bulletIndex.has(focusedKey)) focusBullet(null)
  }

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
    // After the overlay has closed: closing a <dialog> returns focus to the
    // button that opened it, and that focus scroll would cancel ours.
    requestAnimationFrame(() => scrollToLine(link.key))
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

  // Each section's entries; App wraps them in their numbered heading.
  const sectionBodies: Record<CvSectionId, ReactNode> = {
    experience: (
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
    ),
    skills: <SkillsList skills={cv.skills} />,
    projects: <ProjectsList projects={cv.projects} />,
    education: <EducationList education={cv.education} />,
    certifications: <CertificationsList certifications={cv.certifications} />,
    languages: <LanguagesList languages={cv.languages} />,
  }

  return (
    <div id="top">
      <PaperLayout
        figures={columnFigures}
        outline={<Outline sections={sections} experience={cv.experience} />}
      >
        <OutlineMenu sections={sections} experience={cv.experience} />
        <main id="cv" className="py-10">
          <ProfileHero
            profile={profileFor(profile, cvView)}
            controls={<CvViewToggle view={cvView} onChange={changeView} />}
          />
          {sections.map((section) => (
            <CvSection key={section.id} section={section}>
              {sectionBodies[section.id]}
            </CvSection>
          ))}
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
