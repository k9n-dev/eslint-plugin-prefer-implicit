---
"@k9n/eslint-plugin-prefer-implicit": minor
---

Added five new ESLint rules:

- `no-invalid-role`: Detect invalid WAI-ARIA role values (typos, invented roles)
- `no-redundant-aria`: Detect ARIA attributes repeating implicit element values (fixable)
- `no-abstract-role`: Disallow abstract ARIA roles not intended for content authors
- `no-aria-on-non-semantic`: Warn on ARIA attributes on `role="none"`/`"presentation"` elements (fixable)
- `no-positive-tabindex`: Warn on `tabindex` > 0 disrupting natural tab order
