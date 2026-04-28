<p align="center">
  <img src="https://raw.githubusercontent.com/k9n-dev/eslint-plugin-prefer-implicit/main/docs/static/img/logo.svg" alt="Logo of the ESLint plugin: @k9n/eslint-plugin-prefer-implicit" width="120" />
</p>

# @k9n/eslint-plugin-prefer-implicit

> Prefer implicit semantics over explicit ARIA and roles.

## Motivation

Modern HTML already provides rich, implicit semantics. However, many codebases add redundant or even harmful ARIA attributes and roles.

This plugin enforces a simple principle:

> **If the browser already knows it, don't repeat it.**

### Goals

- Reduce unnecessary ARIA usage
- Remove redundant or conflicting roles
- Encourage native HTML semantics
- Prevent accessibility regressions caused by overengineering

## Installation

```bash
npm install --save-dev @k9n/eslint-plugin-prefer-implicit
```

> **Note:** This plugin requires ESLint ^10.0.0 with flat config.

## Configuration

### Using the recommended config

The recommended config enables all six rules at `"warn"` severity:

**ESM (import):**

```js
// eslint.config.js
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [preferImplicit.configs.recommended];
```

**CommonJS (require):**

```js
// eslint.config.js
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = [preferImplicit.default.configs.recommended];
```

### Manual configuration

You can also configure individual rules:

**ESM (import):**

```js
// eslint.config.js
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
  {
    plugins: {
      "prefer-implicit": preferImplicit,
    },
    rules: {
      "prefer-implicit/no-redundant-role": "warn",
      "prefer-implicit/no-destructive-role": "error",
      "prefer-implicit/no-conflicting-aria": "warn",
      "prefer-implicit/no-unsupported-aria": "warn",
      "prefer-implicit/no-default-aria": "warn",
      "prefer-implicit/no-hidden-focusable": "error",
    },
  },
];
```

**CommonJS (require):**

```js
// eslint.config.js
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = [
  {
    plugins: {
      "prefer-implicit": preferImplicit.default,
    },
    rules: {
      "prefer-implicit/no-redundant-role": "warn",
      "prefer-implicit/no-destructive-role": "error",
      "prefer-implicit/no-conflicting-aria": "warn",
      "prefer-implicit/no-unsupported-aria": "warn",
      "prefer-implicit/no-default-aria": "warn",
      "prefer-implicit/no-hidden-focusable": "error",
    },
  },
];
```

## Rules

| Rule | Description | Fixable | Recommended |
| --- | --- | --- | --- |
| [no-redundant-role](#no-redundant-role) | Disallow role attributes that match the element's implicit ARIA role | ✅ | warn |
| [no-destructive-role](#no-destructive-role) | Disallow role attributes that remove native semantics of interactive or structural elements | ✅ | warn |
| [no-conflicting-aria](#no-conflicting-aria) | Disallow `aria-live` values that conflict with the implicit live region behavior of a declared role | ✅ | warn |
| [no-unsupported-aria](#no-unsupported-aria) | Disallow ARIA attributes not supported by the element's role | ✅ | warn |
| [no-default-aria](#no-default-aria) | Disallow ARIA attributes set to their default value or empty string | ✅ | warn |
| [no-hidden-focusable](#no-hidden-focusable) | Disallow elements that are both focusable and `aria-hidden="true"` | ✅ | warn |

---

## Rule Details

### no-redundant-role

Disallow `role` attributes that match the element's implicit ARIA role. For example, `<button>` already has an implicit role of `"button"`, so adding `role="button"` is redundant.

❌ Incorrect:

```jsx
<button role="button">Save</button>
<nav role="navigation">...</nav>
<ul role="list">...</ul>
<li role="listitem">...</li>
<table role="table">...</table>
```

✅ Correct:

```jsx
<button>Save</button>
<nav>...</nav>
<ul>...</ul>
<button role="link">Go</button>
<div role="button">Custom</div>
```

**Autofix:** Removes the redundant `role` attribute.

---

### no-destructive-role

Disallow `role="none"` or `role="presentation"` on interactive or structural elements. These roles strip the element's native semantics, which is almost always a mistake.

❌ Incorrect:

```jsx
<button role="none">Click</button>
<a href="/home" role="presentation">Home</a>
<ul role="presentation">...</ul>
<table role="none">...</table>
```

✅ Correct:

```jsx
<button>Click</button>
<a href="/home">Home</a>
<div role="none">Decorative</div>
<span role="presentation">...</span>
```

**Autofix:** Removes the destructive `role` attribute.

---

### no-conflicting-aria

Disallow `aria-live` values that conflict with the implicit live region behavior of a declared role. For example, `role="alert"` implies `aria-live="assertive"`, so setting `aria-live="polite"` creates a conflict.

❌ Incorrect:

```jsx
<div role="alert" aria-live="polite">Error!</div>
<div role="status" aria-live="assertive">Updated</div>
<div role="log" aria-live="assertive">Log entry</div>
```

✅ Correct:

```jsx
<div role="alert">Error!</div>
<div role="alert" aria-live="assertive">Error!</div>
<div role="status" aria-live="polite">Updated</div>
<div role="status">Updated</div>
```

**Autofix:** Removes the conflicting `aria-live` attribute.

---

### no-unsupported-aria

Disallow ARIA attributes that are not supported by the element's effective role. The effective role is determined by an explicit `role` attribute or the element's implicit role.

❌ Incorrect:

```jsx
<div aria-checked="true">Not a checkbox</div>
<button aria-valuenow="5">Click</button>
<img aria-expanded="true" alt="photo" />
```

✅ Correct:

```jsx
<div role="checkbox" aria-checked="true">Toggle</div>
<button aria-pressed="true">Bold</button>
<button aria-expanded="true">Menu</button>
```

**Autofix:** Removes the unsupported ARIA attribute.

---

### no-default-aria

Disallow ARIA attributes set to their specification-defined default value or to an empty string. These attributes are redundant or invalid and add unnecessary clutter.

❌ Incorrect:

```jsx
<div aria-hidden="false">Visible</div>
<input aria-required="false" />
<button aria-expanded="false">Menu</button>
<button aria-pressed="false">Toggle</button>
<span aria-label="">Empty</span>
<div aria-describedby="">No description</div>
```

✅ Correct:

```jsx
<div>Visible</div>
<input />
<div aria-hidden="true">Hidden</div>
<input aria-required="true" />
<span aria-label="Close dialog">X</span>
```

**Autofix:** Removes the default-valued or empty ARIA attribute.

---

### no-hidden-focusable

Disallow elements that are both focusable and hidden from assistive technologies via `aria-hidden="true"`. This creates a conflict where the element is interactive but invisible to screen readers.

❌ Incorrect:

```jsx
<button aria-hidden="true">Click</button>
<a href="/home" aria-hidden="true">Home</a>
<div tabindex="0" aria-hidden="true">Focusable</div>
```

✅ Correct:

```jsx
<button>Click</button>
<div aria-hidden="true">Decorative</div>
<div tabindex="-1" aria-hidden="true">Programmatic only</div>
```

**Autofix:** Removes the `aria-hidden` attribute.

---

## Detection Matrix

### 1. Redundant Roles

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| R1 | `<button role="button">` | Role equals implicit role | remove role |
| R2 | `<nav role="navigation">` | Redundant landmark role | remove |
| R3 | `<ul role="list">` | Implicit list role | remove |
| R4 | `<li role="listitem">` | Implicit listitem role | remove |
| R5 | `<table role="table">` | Implicit table role | remove |

### 2. Destructive Roles

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| R6 | `<button role="none">` | Removes interactive semantics | remove role |
| R7 | `<a href role="presentation">` | Breaks accessibility | remove role |
| R8 | `<ul role="presentation">` | Removes structural meaning | remove role |

### 3. Role / ARIA Conflicts

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| A1 | `role="alert" aria-live="polite"` | Conflicts with implicit assertive | remove aria-live |
| A2 | `role="status" aria-live="assertive"` | Conflicting politeness | remove |
| A3 | `role="log" aria-live="assertive"` | Redundant or conflicting | remove |

### 4. Unsupported ARIA Attributes

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| A4 | `<div aria-checked="true">` | No valid role context | remove |
| A5 | `<button aria-valuenow="5">` | Invalid attribute for role | remove |
| A6 | `<img aria-expanded="true">` | Unsupported attribute | remove |

### 5. Default ARIA Values

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| D1 | `aria-hidden="false"` | Default value | remove |
| D2 | `aria-required="false"` | Default value | remove |
| D3 | `aria-expanded="false"` | Default (static only) | remove |
| D4 | `aria-pressed="false"` | Default value | remove |

### 6. Empty / Invalid ARIA

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| D5 | `aria-label=""` | Empty label | remove |
| D6 | `aria-*=""` | Invalid empty attribute | remove |

### 7. Interactivity Conflicts

| ID | Pattern | Description | Autofix |
| --- | --- | --- | --- |
| I1 | `<button aria-hidden="true">` | Focusable but hidden | remove aria-hidden |
| I2 | `<a href aria-hidden="true">` | Contradiction | remove |
| I3 | `[tabindex] + aria-hidden` | Focusable but hidden | remove |

---

## Framework Support

This plugin works with multiple frameworks and template syntaxes. It operates on AST nodes provided by the respective parsers and does not parse templates itself.

### React / JSX

Works out of the box with ESLint's built-in JSX support:

```js
// eslint.config.mjs
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
  // ... your existing config
  {
    files: ["**/*.tsx"],
    ...preferImplicit.configs.recommended,
  },
];
```

### Vue

Works with `vue-eslint-parser` for `.vue` single-file component templates. The plugin automatically uses `defineTemplateBodyVisitor` to traverse template nodes:

```js
// eslint.config.ts
import pluginVue from "eslint-plugin-vue";
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
  // ... your existing Vue config (must set up vue-eslint-parser)
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    ...preferImplicit.configs.recommended,
  },
];
```

### Angular

Works with `@angular-eslint/template-parser` for Angular template syntax. Add the plugin config as a separate config object after the Angular template config:

```js
// eslint.config.js
const angular = require("angular-eslint");
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = [
  // ... your existing Angular config
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
  {
    files: ["**/*.html"],
    ...preferImplicit.default.configs.recommended,
  },
];
```

### Plain HTML

Works with HTML ESLint parsers for static HTML files.

## Static vs Dynamic Detection

Autofix is only applied for static attribute values. Dynamic bindings are detected and skipped to avoid breaking runtime behavior.

| Case | Example | Behavior |
| --- | --- | --- |
| Static | `aria-hidden="true"` | Analyzed and fixed |
| Binding | `:aria-hidden="isHidden"` | Ignored |
| Expression | `{condition ? "true" : "false"}` | Ignored |

## Core Philosophy

- ✅ Native HTML first
- ✅ Implicit semantics over explicit declarations
- ✅ Conservative autofix (only when 100% safe)
- ❌ No guessing developer intent
- ❌ No breaking dynamic behavior

## License

MIT
