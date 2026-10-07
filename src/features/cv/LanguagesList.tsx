import { CvSection } from '../../components/CvSection'
import type { Language } from '../../content/schema'

type LanguagesListProps = {
  languages: Language[]
}

export function LanguagesList({ languages }: LanguagesListProps) {
  return (
    <CvSection id="languages" title="Languages">
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        {languages.map((language) => (
          <div key={language.name} className="contents">
            <dt>{language.name}</dt>
            <dd className="font-mono text-xs leading-5 text-ink-muted">{language.level}</dd>
          </div>
        ))}
      </dl>
    </CvSection>
  )
}
