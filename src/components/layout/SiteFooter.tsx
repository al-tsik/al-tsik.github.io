// Evaluated once at module load; calling Date during render is impure.
const currentYear = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="mt-16 border-t border-line pt-6 pb-10 font-mono text-xs text-ink-muted"
    >
      <p>© {currentYear} Aleks. Drawings and models: all rights reserved.</p>
    </footer>
  )
}
