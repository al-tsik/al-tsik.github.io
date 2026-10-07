import { CvSection } from '../../components/CvSection'
import type { Certification } from '../../content/schema'

type CertificationsListProps = {
  certifications: Certification[]
}

export function CertificationsList({ certifications }: CertificationsListProps) {
  return (
    <CvSection id="certifications" title="Certifications">
      <ul className="space-y-3 text-sm">
        {certifications.map((cert) => (
          <li key={cert.name} className="flex items-baseline justify-between gap-4">
            <span>
              {cert.url ? (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-accent hover:underline"
                >
                  {cert.name} ↗
                </a>
              ) : (
                cert.name
              )}
              <span className="text-ink-muted"> · {cert.issuer}</span>
            </span>
            <span className="font-mono text-xs text-ink-muted">{cert.year}</span>
          </li>
        ))}
      </ul>
    </CvSection>
  )
}
