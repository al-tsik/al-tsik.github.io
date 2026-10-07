import type { ReactNode } from 'react'
import type { Profile } from '../../content/schema'

type ProfileHeroProps = {
  profile: Profile
  /** Shown under the contact line, e.g. the CV view toggle. */
  controls?: ReactNode
}

const linkClass = 'underline decoration-line underline-offset-4 hover:text-accent'

/** The title block, set like the printed CV: name, role, contact line, then a rule. */
export function ProfileHero({ profile, controls }: ProfileHeroProps) {
  return (
    <header>
      <div className="border-b border-line pb-3">
        <h1 className="text-3xl leading-tight font-bold tracking-wide uppercase">{profile.name}</h1>
        <p className="mt-1 text-body font-bold text-accent">{profile.role}</p>

        <ul className="mt-2 flex flex-wrap gap-y-1 text-xs text-ink-muted">
          {[
            ...profile.contact,
            ...(profile.cvPdf ? [{ label: 'PDF ↓', href: profile.cvPdf }] : []),
          ].map((item, i) => (
            <li key={item.label} className="flex">
              {/* Separators between items, like a printed CV. */}
              {i > 0 && (
                <span aria-hidden="true" className="px-2 text-ink-faint">
                  •
                </span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  {...(item.href === profile.cvPdf ? { download: true } : {})}
                  className={linkClass}
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      {controls && <div className="mt-3">{controls}</div>}

      {/* The abstract: same heading style as the numbered sections, but unnumbered. */}
      <section aria-labelledby="profile-heading" className="pt-8">
        <h2 id="profile-heading" className="text-lg font-bold">
          Profile
        </h2>
        {/* Justified like the printed CV; hyphenation keeps the word gaps even. */}
        <p className="mt-5 text-body text-justify hyphens-auto">{profile.summary}</p>
      </section>
    </header>
  )
}
