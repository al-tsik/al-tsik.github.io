import { useEffect, useState } from 'react'

type TextFileState =
  { status: 'loading' } | { status: 'loaded'; text: string } | { status: 'error'; message: string }

/** A finished request, tagged with the file it belongs to. */
type Result = { src: string } & Exclude<TextFileState, { status: 'loading' }>

/** Fetches a text file (e.g. a .py from public/) and tracks loading state. */
export function useTextFile(src: string): TextFileState {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(src, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
        return response.text()
      })
      .then((text) => setResult({ src, status: 'loaded', text }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : 'Failed to load'
        setResult({ src, status: 'error', message })
      })

    return () => controller.abort()
  }, [src])

  // Still loading if nothing has finished yet for the current src.
  return result?.src === src ? result : { status: 'loading' }
}
