# no-hidden-focusable

Disallow elements that are both focusable and `aria-hidden="true"`.

**✅ Fixable** · **Recommended: warn**

## Why

When an element is focusable but hidden from assistive technologies via `aria-hidden="true"`, screen reader users can tab to it but won't know what it is. This creates a confusing and broken experience.

## Examples

### ❌ Incorrect

```jsx
<button aria-hidden="true">Click</button>
<a href="/home" aria-hidden="true">Home</a>
<div tabindex="0" aria-hidden="true">Focusable</div>
```

### ✅ Correct

```jsx
<button>Click</button>
<div aria-hidden="true">Decorative</div>
<div tabindex="-1" aria-hidden="true">Programmatic only</div>
```

## Autofix

Removes the `aria-hidden` attribute.

```diff
- <button aria-hidden="true">Click</button>
+ <button>Click</button>
```

## Details

An element is considered **focusable** if:

1. It's a natively interactive element: `<a>` (with `href`), `<button>`, `<details>`, `<embed>`, `<iframe>`, `<input>`, `<select>`, `<summary>`, `<textarea>`
2. Or it has a `tabindex` attribute with a value ≥ 0

Elements with `tabindex="-1"` are **not** considered focusable (they can only receive focus programmatically, not via keyboard navigation), so `aria-hidden="true"` is allowed on them.

Dynamic `aria-hidden` values are skipped.
