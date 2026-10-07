import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { SplitLayout } from './components/layout/SplitLayout'
import { profile } from './content'
import { ProfileHero } from './features/cv/ProfileHero'

function App() {
  return (
    <div id="top">
      <SiteHeader />
      <SplitLayout
        aside={
          <div className="grid h-full place-items-center font-mono text-xs text-ink-faint uppercase">
            3D viewer placeholder
          </div>
        }
      >
        <main id="cv" className="py-10">
          <ProfileHero profile={profile} />
        </main>
        <SiteFooter />
      </SplitLayout>
    </div>
  )
}

export default App
