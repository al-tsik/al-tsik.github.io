import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { SplitLayout } from './components/layout/SplitLayout'
import { building, cv, profile } from './content'
import { CertificationsList } from './features/cv/CertificationsList'
import { EducationList } from './features/cv/EducationList'
import { ExperienceTimeline } from './features/cv/ExperienceTimeline'
import { LanguagesList } from './features/cv/LanguagesList'
import { ProfileHero } from './features/cv/ProfileHero'
import { SkillsList } from './features/cv/SkillsList'
import { BuildingViewer } from './features/viewer/BuildingViewer'
import { useSelectionStore } from './state/selectionStore'

function App() {
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)

  return (
    <div id="top">
      <SiteHeader name={profile.name} role={profile.role} />
      <SplitLayout aside={<BuildingViewer modelSrc={building.model.src} parts={building.parts} />}>
        <main id="cv" className="py-10">
          <ProfileHero profile={profile} />
          <ExperienceTimeline experience={cv.experience} highlightPartId={selectedPartId} />
          <SkillsList skills={cv.skills} />
          <EducationList education={cv.education} />
          <CertificationsList certifications={cv.certifications} />
          <LanguagesList languages={cv.languages} />
        </main>
        <SiteFooter name={profile.name} />
      </SplitLayout>
    </div>
  )
}

export default App
