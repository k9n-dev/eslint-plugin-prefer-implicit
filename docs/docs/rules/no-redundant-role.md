# no-redundant-role

Disallow `role` attributes that match the element's implicit ARIA role.

**✅ Fixable** · **Recommended: warn**

## Why

Many HTML elements have implicit ARIA roles. For example, `<button>` already has the role `"button"`. Adding `role="button"` is redundant and clutters the code.

## Examples

### ❌ Incorrect

```jsx
<button role="button">Save</button>
<nav role="navigation">...</nav>
<ul role="list">...</ul>
<li role="listitem">...</li>
<table role="table">...</table>
```

### ✅ Correct

```jsx
<button>Save</button>
<nav>...</nav>
<ul>...</ul>
<button role="link">Go</button>
<div role="button">Custom</div>
```

## Autofix

Removes the redundant `role` attribute.

```diff
- <button role="button">Save</button>
+ <button>Save</button>
```

## Details

The rule uses a mapping of HTML elements to their implicit ARIA roles based on the [ARIA in HTML](https://www.w3.org/TR/html-aria/) specification. Some elements have conditional implicit roles — for example, `<a>` only has the implicit role `"link"` when it has an `href` attribute.

Dynamic role values (JSX expressions, Vue bindings, Angular bindings) are skipped.
