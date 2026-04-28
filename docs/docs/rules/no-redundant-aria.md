# no-redundant-aria

Detect ARIA attributes that repeat the implicit value already provided by the HTML element.

**✅ Fixable** · **Recommended: warn**

## Why

HTML elements carry implicit ARIA attribute values defined by the spec. For example, `<h2>` implicitly has `aria-level="2"`. Setting these explicitly is redundant clutter that adds no accessibility benefit.

## Examples

### ❌ Incorrect

```jsx
<h1 aria-level="1">Title</h1>
<h2 aria-level="2">Subtitle</h2>
<h3 aria-level="3">Section</h3>
<hr aria-orientation="horizontal" />
<progress aria-valuemin="0" />
<progress aria-valuemax="100" />
```

### ✅ Correct

```jsx
<h1>Title</h1>
<h1 aria-level="2">Demoted heading</h1>
<hr />
<progress />
<details aria-expanded="true">Open</details>
```

## Autofix

Removes the redundant ARIA attribute.

```diff
- <h2 aria-level="2">Subtitle</h2>
+ <h2>Subtitle</h2>
```

## Details

The rule uses a mapping of HTML elements to their implicit ARIA attribute values based on the HTML-AAM specification:

| Element | Implicit Attribute | Value |
| --- | --- | --- |
| `h1`–`h6` | `aria-level` | `"1"`–`"6"` |
| `input`, `textarea`, `select` | `aria-required` | `"false"` |
| `details` | `aria-expanded` | `"false"` |
| `dialog` | `aria-modal` | `"false"` |
| `hr` | `aria-orientation` | `"horizontal"` |
| `progress` | `aria-valuemin`, `aria-valuemax` | `"0"`, `"100"` |

Dynamic attribute values and component elements are skipped.
