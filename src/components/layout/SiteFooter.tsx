// Evaluated once at module load; calling Date during render is impure.
const currentYear = new Date().getFullYear()

type SiteFooterProps = {
  name: string
}

export function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer id="contact" className="mt-16 border-t border-line pt-6 pb-10 text-xs text-ink-muted">
      <p>
        © {currentYear} {name}. Drawings and models: all rights reserved.
      </p>
    </footer>
  )
}
