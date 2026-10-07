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
import { useFigureFocus } from './features/figures/useFigureFocus'
import { Outline } from './features/outline/Outline'
import { OutlineMenu } from './features/outline/OutlineMenu'
import { useEscapeToDeselect } from './hooks/useEscapeToDeselect'
import { useSelectionUrlSync } from './hooks/useSelectionUrlSync'
import { nextFocus } from './lib/figureVisibility'
import { useSelectionStore } from './state/selectionStore'

// Module-level so the array identity is stable across renders.
const partIds = building.parts.map((part) => part.id)

function App() {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const focusBullet = useSelectionStore((state) => state.focusBullet)
  const openFigure = useSelectionStore((state) => state.openFigure)
  const figureFocus = useFigureFocus(figures, bulletIndex, modelFigureId)
  useSelectionUrlSync(partIds)
  useEscapeToDeselect()

  const focusedMainKey = focusedKey ? (bulletIndex.get(focusedKey)?.parentKey ?? focusedKey) : null
  const onBulletFocus = (key: string) => focusBullet(nextFocus(focusedKey, key, bulletIndex))

  return (
    <div id="top">
      <SiteHeader name={profile.name} role={profile.role} />
      <PaperLayout
        figures={
          <FigureColumn
            focus={figureFocus}
            figureById={figureById}
            numbers={figureNumbers}
            building={building}
            onOpen={openFigure}
          />
        }
        outline={<Outline experience={cv.experience} />}
      >
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
          />
          <SkillsList skills={cv.skills} />
          <EducationList education={cv.education} />
          <CertificationsList certifications={cv.certifications} />
          <LanguagesList languages={cv.languages} />
        </main>
        <SiteFooter name={profile.name} />
      </PaperLayout>
    </div>
  )
}

export default App
