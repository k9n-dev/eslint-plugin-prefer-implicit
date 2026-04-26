# no-default-aria

Disallow ARIA attributes set to their specification-defined default value or to an empty string.

**✅ Fixable** · **Recommended: warn**

## Why

Setting an ARIA attribute to its default value is redundant — the browser already assumes that value. Empty string values are invalid and provide no useful information to assistive technologies.

## Examples

### ❌ Incorrect

```jsx
<div aria-hidden="false">Visible</div>
<input aria-required="false" />
<button aria-expanded="false">Menu</button>
<button aria-pressed="false">Toggle</button>
<span aria-label="">Empty</span>
<div aria-describedby="">No description</div>
```

### ✅ Correct

```jsx
<div>Visible</div>
<input />
<div aria-hidden="true">Hidden</div>
<input aria-required="true" />
<span aria-label="Close dialog">X</span>
```

## Autofix

Removes the default-valued or empty ARIA attribute.

```diff
- <div aria-hidden="false">Visible</div>
+ <div>Visible</div>
```

## Default Values

The following `aria-*` attributes have a default value of `"false"`:

`aria-hidden`, `aria-required`, `aria-expanded`, `aria-pressed`, `aria-disabled`, `aria-checked`, `aria-selected`, `aria-grabbed`, `aria-atomic`, `aria-busy`, `aria-modal`, `aria-multiline`, `aria-multiselectable`, `aria-readonly`

Additionally, any `aria-*` attribute set to an empty string `""` is flagged.

The rule uses two different message IDs:
- `defaultAriaValue` — for attributes set to their spec default
- `emptyAriaValue` — for attributes set to an empty string

Dynamic attribute values are skipped.
