import type { Certification } from '../../content/schema'
import { CvSection } from './CvSection'

type CertificationsListProps = {
  certifications: Certification[]
}

export function CertificationsList({ certifications }: CertificationsListProps) {
  return (
    <CvSection id="certifications">
      <ul className="space-y-2 font-serif text-body">
        {certifications.map((cert) => (
          <li key={cert.name} className="grid grid-cols-[5.5rem_1fr] gap-x-6">
            {/* Year in the same gutter as the timeline dates. */}
            <span className="pt-1.5 text-right font-mono text-[11px] text-ink-muted">
              {cert.year}
            </span>
            <span>
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-line underline-offset-4 hover:text-accent"
                >
                  {cert.name} ↗
                </a>
              ) : (
                cert.name
              )}
              <span className="text-ink-muted italic">, {cert.issuer}</span>
            </span>
          </li>
        ))}
      </ul>
    </CvSection>
  )
}
