import { cvViews, type CvView } from '../../lib/cvView'

const labels: Record<CvView, string> = {
  both: 'Both',
  developer: 'Developer',
  architect: 'Architect',
}

type CvViewToggleProps = {
  view: CvView
  onChange: (view: CvView) => void
}

/** Segmented control choosing how the CV is read: Both · Developer · Architect. */
export function CvViewToggle({ view, onChange }: CvViewToggleProps) {
  return (
    <div role="group" aria-label="Show the CV as" className="flex items-center gap-1 text-[11px]">
      {cvViews.map((option, i) => (
        <span key={option} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-faint">
              ·
            </span>
          )}
          <button
            type="button"
            aria-pressed={option === view}
            onClick={() => onChange(option)}
            className={`cursor-pointer rounded-sm px-1.5 py-0.5 transition-colors ${
              option === view
                ? 'bg-accent-soft font-bold text-accent'
                : 'text-ink-muted hover:text-accent'
            }`}
          >
            {labels[option]}
          </button>
        </span>
      ))}
    </div>
  )
}
