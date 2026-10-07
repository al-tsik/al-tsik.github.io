import type { Profile } from '../../content/schema'

type ProfileHeroProps = {
  profile: Profile
}

const linkClass = 'underline decoration-line underline-offset-4 hover:text-accent'

/** The paper's title block: name as title, role as affiliation, summary as abstract. */
export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <header className="pb-10 font-serif">
      <div className="text-center">
        <h1 className="text-5xl leading-tight font-medium tracking-tight">{profile.name}</h1>
        <p className="mt-3 text-body text-ink-muted italic">
          {profile.role} — {profile.location}
        </p>

        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-xs">
          <li>
            <a href={`mailto:${profile.email}`} className={linkClass}>
              {profile.email}
            </a>
          </li>
          {profile.links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noreferrer" className={linkClass}>
                {link.label} ↗
              </a>
            </li>
          ))}
          {profile.cvPdf && (
            <li>
              <a href={profile.cvPdf} download className={linkClass}>
                PDF ↓
              </a>
            </li>
          )}
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
