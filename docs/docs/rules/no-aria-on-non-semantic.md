# no-aria-on-non-semantic

Warn on ARIA attributes placed on elements with `role="none"` or `role="presentation"`.

**✅ Fixable** · **Recommended: warn**

## Why

When an element has `role="none"` or `role="presentation"`, its native semantics are stripped. Assistive technology ignores the element entirely, which means any `aria-*` attributes on it have no effect. They're dead code that misleads developers into thinking the element is accessible.

## Examples

### ❌ Incorrect

```jsx
<div role="none" aria-label="Section">...</div>
<span role="presentation" aria-hidden="true">...</span>
<div role="none" aria-describedby="desc" aria-live="polite">...</div>
```

### ✅ Correct

```jsx
<div role="none">...</div>
<span role="presentation">...</span>
<div role="button" aria-label="Close">...</div>
<div aria-label="Section">...</div>
```

## Autofix

Removes the ARIA attribute(s) from the presentation element.

```diff
- <div role="none" aria-label="Section">...</div>
+ <div role="none">...</div>
```

## Details

The rule triggers on elements where the `role` attribute is statically set to `"none"` or `"presentation"` (case-insensitive). Each `aria-*` attribute with a static value is reported individually.

Dynamic role values and dynamic ARIA attribute values are skipped.
