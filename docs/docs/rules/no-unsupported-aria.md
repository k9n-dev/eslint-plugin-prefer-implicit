# no-unsupported-aria

Disallow ARIA attributes not supported by the element's role.

**✅ Fixable** · **Recommended: warn**

## Why

Each ARIA role defines a set of supported `aria-*` attributes. Using an unsupported attribute has no effect and may indicate a misunderstanding of the element's semantics.

## Examples

### ❌ Incorrect

```jsx
<div role="generic" aria-checked="true">Not a checkbox</div>
<button aria-valuenow="5">Click</button>
<img aria-expanded="true" alt="photo" />
```

### ✅ Correct

```jsx
<div role="checkbox" aria-checked="true">Toggle</div>
<button aria-pressed="true">Bold</button>
<button aria-expanded="true">Menu</button>
```

## Autofix

Removes the unsupported ARIA attribute.

```diff
- <button aria-valuenow="5">Click</button>
+ <button>Click</button>
```

## Details

The rule determines the **effective role** of an element:

1. If an explicit `role` attribute is present, that role is used
2. Otherwise, the element's implicit role from the HTML spec is used
3. If no role can be determined, the element is skipped

For each `aria-*` attribute on the element, the rule checks whether it's in the set of supported attributes for that role. Global ARIA attributes (like `aria-label`, `aria-hidden`, `aria-describedby`) are supported by all roles.

Dynamic attribute values are skipped. Elements with no determinable role are skipped.
