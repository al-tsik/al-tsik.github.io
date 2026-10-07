import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { SplitLayout } from './components/layout/SplitLayout'
import { cv, profile } from './content'
import { EducationList } from './features/cv/EducationList'
import { ExperienceTimeline } from './features/cv/ExperienceTimeline'
import { ProfileHero } from './features/cv/ProfileHero'
import { SkillsList } from './features/cv/SkillsList'

function App() {
  return (
    <div id="top">
      <SiteHeader name={profile.name} role={profile.role} />
      <SplitLayout
        aside={
          <div className="grid h-full place-items-center font-mono text-xs text-ink-faint uppercase">
            3D viewer placeholder
          </div>
        }
      >
        <main id="cv" className="py-10">
          <ProfileHero profile={profile} />
          <ExperienceTimeline experience={cv.experience} />
          <SkillsList skills={cv.skills} />
          <EducationList education={cv.education} />
        </main>
        <SiteFooter name={profile.name} />
      </SplitLayout>
    </div>
  )
}

export default App
