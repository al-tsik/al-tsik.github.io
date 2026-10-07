import type { Profile } from '../../content/schema'

type ProfileHeroProps = {
  profile: Profile
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <header className="border-b border-line pb-8">
      <p className="font-mono text-xs tracking-widest text-ink-muted uppercase">
        {profile.role} · {profile.location}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{profile.name}</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-ink-muted">{profile.summary}</p>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase">
        <li>
          <a
            href={`mailto:${profile.email}`}
            className="underline-offset-4 hover:text-accent hover:underline"
          >
            Email
          </a>
        </li>
        {profile.links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:text-accent hover:underline"
            >
              {link.label} ↗
            </a>
          </li>
        ))}
      </ul>

      {profile.cvPdf && (
        <a
          href={profile.cvPdf}
          download
          className="mt-6 inline-flex items-center gap-2 border border-ink px-4 py-2 font-mono text-xs uppercase transition-colors hover:bg-ink hover:text-paper"
        >
          Download CV (PDF) ↓
        </a>
      )}
    </header>
  )
}
