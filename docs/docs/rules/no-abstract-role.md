# no-abstract-role

Disallow abstract ARIA roles that are not intended for use by content authors.

**❌ Not fixable** · **Recommended: warn**

## Why

Abstract roles exist only as ontological superclasses in the WAI-ARIA taxonomy. They define shared properties for concrete roles but must never appear in markup. Assistive technology does not recognize them, so using one leaves the element without a meaningful role.

## Examples

### ❌ Incorrect

```jsx
<div role="widget">Custom control</div>
<div role="landmark">Section</div>
<div role="command">Action</div>
<div role="composite">Group</div>
<div role="input">Field</div>
```

### ✅ Correct

```jsx
<div role="button">Custom control</div>
<div role="navigation">Section</div>
<div role="link">Action</div>
<div role="listbox">Group</div>
<div role="textbox">Field</div>
```

## Details

The twelve abstract roles are:

`command`, `composite`, `input`, `landmark`, `range`, `roletype`, `section`, `sectionhead`, `select`, `structure`, `widget`, `window`

Comparison is case-insensitive — `role="Widget"` is still reported.

No autofix is provided because the intended concrete role is unclear.

Dynamic role values (JSX expressions, Vue bindings, Angular bindings) are skipped.
