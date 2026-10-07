import { useState } from 'react'
import { Lightbox } from '../../components/Lightbox'
import type { DynamoScript } from '../../content/schema'
import { PythonPreview } from '../figures/PythonPreview'

type DynamoScriptCardProps = {
  script: DynamoScript
}

export function DynamoScriptCard({ script }: DynamoScriptCardProps) {
  const [isGraphOpen, setIsGraphOpen] = useState(false)
  // Only fetch the Python file once the visitor asks to see it.
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  return (
    <article className="border border-line bg-surface">
      <button
        type="button"
        onClick={() => setIsGraphOpen(true)}
        className="group block w-full cursor-zoom-in"
      >
        <img
          src={script.graphImage.src}
          alt={script.graphImage.alt}
          loading="lazy"
          className="aspect-[16/9] w-full border-b border-line object-cover transition-opacity group-hover:opacity-80"
        />
      </button>

      <div className="space-y-2 p-3">
        <h4 className="text-sm font-semibold tracking-tight">{script.title}</h4>
        <p className="text-xs leading-relaxed text-ink-muted">{script.description}</p>

        {script.pythonFile && (
          <details onToggle={(event) => setIsCodeOpen(event.currentTarget.open)}>
            <summary className="cursor-pointer font-mono text-[10px] tracking-widest text-ink-muted uppercase hover:text-accent">
              Python source
            </summary>
            <div className="mt-2">{isCodeOpen && <PythonPreview src={script.pythonFile} />}</div>
          </details>
        )}
      </div>

      <Lightbox
        image={isGraphOpen ? script.graphImage : null}
        onClose={() => setIsGraphOpen(false)}
      />
    </article>
  )
}
