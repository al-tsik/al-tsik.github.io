import { Highlight } from 'prism-react-renderer'
import { useTextFile } from '../../hooks/useTextFile'
import { codeTheme } from './codeTheme'

type PythonPreviewProps = {
  src: string
}

/** Syntax-highlighted Python source loaded from public/. */
export function PythonPreview({ src }: PythonPreviewProps) {
  const file = useTextFile(src)

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
          className={`${className} max-h-80 overflow-auto border border-line p-3 font-mono text-[10px] leading-relaxed`}
          style={style}
        >
          {tokens.map((line, lineIndex) => (
            <div key={lineIndex} {...getLineProps({ line })}>
              <span className="mr-3 inline-block w-5 text-right text-ink-faint select-none">
                {lineIndex + 1}
              </span>
              {line.map((token, tokenIndex) => (
                <span key={tokenIndex} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
