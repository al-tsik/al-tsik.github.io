import type { Certification } from '../../content/schema'
import { CvSection } from './CvSection'

type CertificationsListProps = {
  certifications: Certification[]
}

export function CertificationsList({ certifications }: CertificationsListProps) {
  return (
    <CvSection id="certifications">
      <ul className="space-y-2 text-body">
        {certifications.map((cert) => (
          <li key={cert.name} className="flex items-baseline justify-between gap-4">
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
            {/* Right-aligned, like the dates on the role lines. */}
            <span className="shrink-0 text-[11px] text-ink-muted">{cert.year}</span>
          </li>
        ))}
      </ul>
    </CvSection>
  )
}
