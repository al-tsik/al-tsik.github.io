import { SiteFooter } from './components/layout/SiteFooter'
import { PaperLayout } from './components/layout/PaperLayout'
import { SiteHeader } from './components/layout/SiteHeader'
import { building, cv, profile } from './content'
import { CertificationsList } from './features/cv/CertificationsList'
import { EducationList } from './features/cv/EducationList'
import { ExperienceTimeline } from './features/cv/ExperienceTimeline'
import { LanguagesList } from './features/cv/LanguagesList'
import { ProfileHero } from './features/cv/ProfileHero'
import { SkillsList } from './features/cv/SkillsList'
import { PartDetailsPanel } from './features/panel/PartDetailsPanel'
import { BuildingViewer } from './features/viewer/BuildingViewer'
import { useEscapeToDeselect } from './hooks/useEscapeToDeselect'
import { useSelectionUrlSync } from './hooks/useSelectionUrlSync'
import { useSelectionStore } from './state/selectionStore'

// Module-level so the array identity is stable across renders.
const partIds = building.parts.map((part) => part.id)

function App() {
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)
  useSelectionUrlSync(partIds)
  useEscapeToDeselect()

  return (
    <div id="top">
      <SiteHeader name={profile.name} role={profile.role} />
      <PaperLayout
        figures={
          <>
            <div className="relative h-[60dvh] lg:h-[60%]">
              <BuildingViewer modelSrc={building.model.src} parts={building.parts} />
            </div>
            <PartDetailsPanel parts={building.parts} />
          </>
        }
      >
        <main id="cv" className="py-10">
          <ProfileHero profile={profile} />
          <ExperienceTimeline experience={cv.experience} highlightPartId={selectedPartId} />
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
