# no-positive-tabindex

Warn on `tabindex` values greater than 0.

**❌ Not fixable** · **Recommended: warn**

## Why

A positive `tabindex` forces an element to the front of the tab order, regardless of its position in the DOM. This disrupts the natural reading flow and makes keyboard navigation unpredictable — especially as the page grows or changes.

Using `tabindex="0"` (adds to natural order) or `tabindex="-1"` (programmatic focus only) is almost always the right approach.

## Examples

### ❌ Incorrect

```jsx
<input tabindex="1" />
<button tabindex="5">Submit</button>
<div tabindex="99" role="button">Custom</div>
```

### ✅ Correct

```jsx
<input tabindex="0" />
<button tabindex="-1">Hidden from tab</button>
<div tabindex="0" role="button">Custom</div>
<input />
```

## Details

The rule checks the static value of the `tabindex` attribute. If the value parses to an integer greater than 0, a warning is reported.

No autofix is provided because the correct tab order depends on page layout and cannot be determined statically.

Non-numeric values and dynamic values (JSX expressions, Vue bindings, Angular bindings) are skipped.
