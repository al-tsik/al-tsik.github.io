import type { PrismTheme } from 'prism-react-renderer'

/**
 * Syntax colours matching the site's paper/ink palette: mostly greyscale,
 * with the accent reserved for keywords. Keep in sync with src/index.css.
 */
export const codeTheme: PrismTheme = {
  plain: { color: '#141414', backgroundColor: '#ffffff' },
  styles: [
    { types: ['comment'], style: { color: '#a3a3a3', fontStyle: 'italic' } },
    { types: ['keyword', 'builtin', 'boolean'], style: { color: '#ff5a1f' } },
    { types: ['string', 'number'], style: { color: '#6b6b6b' } },
    { types: ['function', 'class-name'], style: { fontWeight: '600' } },
    { types: ['punctuation', 'operator'], style: { color: '#6b6b6b' } },
  ],
}
