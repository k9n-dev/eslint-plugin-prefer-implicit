# no-destructive-role

Disallow `role="none"` or `role="presentation"` on interactive or structural elements.

**✅ Fixable** · **Recommended: warn**

## Why

The roles `"none"` and `"presentation"` strip an element's native semantics. Applying them to interactive elements (like `<button>`) or structural elements (like `<ul>`, `<table>`) removes their meaning from the accessibility tree, which is almost always a mistake.

## Examples

### ❌ Incorrect

```jsx
<button role="none">Click</button>
<a href="/home" role="presentation">Home</a>
<ul role="presentation">...</ul>
<table role="none">...</table>
```

### ✅ Correct

```jsx
<button>Click</button>
<a href="/home">Home</a>
<div role="none">Decorative</div>
<span role="presentation">...</span>
```

## Autofix

Removes the destructive `role` attribute.

```diff
- <button role="none">Click</button>
+ <button>Click</button>
```

## Details

The rule flags elements from two categories:

**Interactive elements:** `<a>` (with `href`), `<button>`, `<details>`, `<embed>`, `<iframe>`, `<input>`, `<select>`, `<summary>`, `<textarea>`

**Structural elements:** `<ul>`, `<ol>`, `<li>`, `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<td>`, `<th>`, `<dl>`, `<dt>`, `<dd>`, `<menu>`

Non-interactive, non-structural elements like `<div>` or `<span>` are not flagged. Dynamic role values are skipped.
