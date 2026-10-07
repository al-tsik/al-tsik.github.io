import type { Profile } from '../../content/schema'

type ProfileHeroProps = {
  profile: Profile
}

const linkClass = 'underline decoration-line underline-offset-4 hover:text-accent'

/** The title block, set like the printed CV: name, role, contact line, then a rule. */
export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <header className="pb-10">
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

      <section aria-labelledby="abstract-heading" className="mx-auto mt-10 max-w-[34rem]">
        <h2
          id="abstract-heading"
          className="text-center font-sans text-xs font-semibold tracking-[0.2em] uppercase"
        >
          Abstract
        </h2>
        {/* Left-aligned: justified text leaves rivers at this measure on screen. */}
        <p className="mt-3 text-body text-pretty">{profile.summary}</p>
      </section>
    </header>
  )
}
