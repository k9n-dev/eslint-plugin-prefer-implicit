# no-conflicting-aria

Disallow `aria-live` values that conflict with the implicit live region behavior of a declared role.

**✅ Fixable** · **Recommended: warn**

## Why

Certain ARIA roles imply a specific `aria-live` value. For example, `role="alert"` implies `aria-live="assertive"`. Setting a different `aria-live` value creates a conflict that can confuse assistive technologies.

## Examples

### ❌ Incorrect

```jsx
<div role="alert" aria-live="polite">Error!</div>
<div role="status" aria-live="assertive">Updated</div>
<div role="log" aria-live="assertive">Log entry</div>
```

### ✅ Correct

```jsx
<div role="alert">Error!</div>
<div role="alert" aria-live="assertive">Error!</div>
<div role="status" aria-live="polite">Updated</div>
<div role="status">Updated</div>
```

## Autofix

Removes the conflicting `aria-live` attribute.

```diff
- <div role="alert" aria-live="polite">Error!</div>
+ <div role="alert">Error!</div>
```

## Role → Implied `aria-live` Mapping

| Role | Implied `aria-live` |
| --- | --- |
| `alert` | `assertive` |
| `status` | `polite` |
| `log` | `polite` |
| `marquee` | `off` |
| `timer` | `off` |

When the `aria-live` value matches the implied value, no violation is reported (it's redundant but not conflicting). Dynamic `aria-live` values are skipped.
