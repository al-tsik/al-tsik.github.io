import type { ComponentProps } from 'react'
import { Outline } from './Outline'

/** The outline as a collapsible "Contents" menu, for screens without the side column. */
export function OutlineMenu(props: ComponentProps<typeof Outline>) {
  return (
    <details className="sticky top-14 z-10 -mx-4 border-b border-line bg-paper/95 px-4 py-2 backdrop-blur lg:hidden">
      <summary className="cursor-pointer font-mono text-[10px] tracking-widest text-ink-muted uppercase">
        Contents
      </summary>
      <div className="pt-3 pb-2">
        <Outline {...props} />
      </div>
    </details>
  )
}
