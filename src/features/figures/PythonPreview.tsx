import { Highlight } from 'prism-react-renderer'
import { useEffect, useRef } from 'react'
import { useTextFile } from '../../hooks/useTextFile'
import { codeTheme } from './codeTheme'

type PythonPreviewProps = {
  src: string
  /** Lines to highlight, [from, to] (1-based, inclusive). */
  highlight?: readonly [number, number]
}

/** Syntax-highlighted Python source loaded from public/. */
export function PythonPreview({ src, highlight }: PythonPreviewProps) {
  const file = useTextFile(src)
  const preRef = useRef<HTMLPreElement>(null)
  const [from, to] = highlight ?? [0, -1]

  // Scroll the code box (not the page) so the highlighted lines are in view.
  useEffect(() => {
    const pre = preRef.current
    const first = pre?.querySelector<HTMLElement>('[data-highlighted]')
    if (!pre || !first) return
    pre.scrollTo({ top: first.offsetTop - pre.clientHeight / 3, behavior: 'smooth' })
  }, [file.status, from, to])

  if (file.status === 'loading') {
    return <p className="font-mono text-[10px] text-ink-muted">Loading…</p>
  }
  if (file.status === 'error') {
    return (
      <p role="alert" className="font-mono text-[10px] text-accent">
        Couldn’t load {src} ({file.message})
      </p>
    )
  }

  return (
    <Highlight code={file.text.trimEnd()} language="python" theme={codeTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          ref={preRef}
          className={`${className} relative max-h-80 overflow-auto border border-line py-3 font-mono text-[10px] leading-relaxed`}
          style={style}
        >
          {tokens.map((line, lineIndex) => {
            const number = lineIndex + 1
            const isHighlighted = number >= from && number <= to
            const lineProps = getLineProps({ line })

            return (
              <div
                key={lineIndex}
                {...lineProps}
                data-highlighted={isHighlighted || undefined}
                className={`${lineProps.className} px-3 ${isHighlighted ? 'bg-accent-soft' : ''}`}
              >
                <span
                  className={`mr-3 inline-block w-5 text-right select-none ${
                    isHighlighted ? 'text-accent' : 'text-ink-faint'
                  }`}
                >
                  {number}
                </span>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}
