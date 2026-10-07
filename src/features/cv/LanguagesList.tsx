import type { Language } from '../../content/schema'
import { CvSection } from './CvSection'

type LanguagesListProps = {
  languages: Language[]
}

export function LanguagesList({ languages }: LanguagesListProps) {
  return (
    <CvSection id="languages">
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-serif text-body">
        {languages.map((language) => (
          <div key={language.name} className="contents">
            <dt>{language.name}</dt>
            <dd className="text-ink-muted italic">{language.level}</dd>
          </div>
        ))}
      </dl>
    </CvSection>
  )
}
