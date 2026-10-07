type SiteHeaderProps = {
  name: string
  role: string
}

export function SiteHeader({ name, role }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:px-6">
      <a href="#top" className="flex items-baseline gap-3">
        <span className="font-semibold tracking-tight">{name}</span>
        <span className="hidden font-mono text-xs text-ink-muted uppercase sm:inline">{role}</span>
      </a>
      <nav aria-label="Primary">
        <ul className="flex gap-4 font-mono text-xs uppercase">
          <li>
            <a href="#building" className="hover:text-accent">
              Building
            </a>
          </li>
          <li>
            <a href="#cv" className="hover:text-accent">
              CV
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-accent">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
