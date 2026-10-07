import { CodePreview, type CodeLanguage } from './CodePreview'

type CodeFigureProps = {
  src: string
  language: CodeLanguage
  /** Lines to highlight from the current view, [from, to]. */
  lines?: readonly [number, number]
}

/** A source file (e.g. a Dynamo Python node) with syntax highlighting. */
export function CodeFigure({ src, language, lines }: CodeFigureProps) {
  const fileName = src.split('/').pop()

  return (
    <div>
      <p className="border-b border-line px-3 py-1.5 font-mono text-[10px] text-ink-muted">
        {fileName}
      </p>
      <CodePreview src={src} language={language} highlight={lines} />
    </div>
  )
}
