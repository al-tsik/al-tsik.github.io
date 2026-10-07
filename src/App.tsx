import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { SplitLayout } from './components/layout/SplitLayout'

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
          <h1 className="text-3xl font-semibold tracking-tight">CV placeholder</h1>
          <div className="mt-6 h-[150vh] rounded border border-dashed border-line" />
        </main>
        <SiteFooter />
      </SplitLayout>
    </div>
  )
}

export default App
