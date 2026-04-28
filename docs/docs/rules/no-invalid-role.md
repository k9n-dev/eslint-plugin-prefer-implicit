# no-invalid-role

Detect invalid WAI-ARIA role values (typos, invented roles).

**❌ Not fixable** · **Recommended: warn**

## Why

Using an invalid role value — whether from a typo or an invented name — means assistive technology won't recognize the element's purpose. The element effectively has no role, which can break the accessibility tree.

## Examples

### ❌ Incorrect

```jsx
<div role="buton">Click</div>
<div role="superwidget">Custom</div>
<nav role="nagivation">...</nav>
<div role="buttn checkbox">Toggle</div>
```

### ✅ Correct

```jsx
<div role="button">Click</div>
<div role="navigation">...</div>
<div role="checkbox">Toggle</div>
<div role="button link">Dual role</div>
```

## Details

The rule validates each space-separated role token against the full set of WAI-ARIA 1.2 roles. Comparison is case-insensitive — `role="Button"` is valid.

Multiple role tokens are validated independently. If a `role` attribute contains `"button nagivation"`, only `nagivation` is reported as invalid.

Dynamic role values (JSX expressions, Vue bindings, Angular bindings) are skipped.

No autofix is provided because the intended role is unclear from a typo.
