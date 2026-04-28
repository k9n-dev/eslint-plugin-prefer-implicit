<p align="center">
  <img src="https://raw.githubusercontent.com/k9n-dev/eslint-plugin-prefer-implicit/main/docs/static/img/logo.svg" alt="Logo of the ESLint plugin: @k9n/eslint-plugin-prefer-implicit" width="120" />
</p>

# @k9n/eslint-plugin-prefer-implicit

> Prefer implicit semantics over explicit ARIA and roles.

📖 **Full documentation:** https://k9n-dev.github.io/eslint-plugin-prefer-implicit/

## Motivation

Modern HTML already provides rich, implicit semantics. However, many codebases add redundant or even harmful ARIA attributes and roles. This plugin enforces a simple principle:

> **If the browser already knows it, don't repeat it.**

## Installation

```bash
npm install --save-dev @k9n/eslint-plugin-prefer-implicit
```

> **Note:** This plugin requires ESLint ^10.0.0 with flat config.

## Configuration

### Recommended config

Enables all rules at `"warn"` severity:

```js
// eslint.config.js
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [preferImplicit.configs.recommended];
```

### Manual configuration

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
      "prefer-implicit/no-destructive-role": "warn",
      "prefer-implicit/no-conflicting-aria": "warn",
      "prefer-implicit/no-unsupported-aria": "warn",
      "prefer-implicit/no-default-aria": "warn",
      "prefer-implicit/no-hidden-focusable": "warn",
      "prefer-implicit/no-invalid-role": "warn",
      "prefer-implicit/no-redundant-aria": "warn",
      "prefer-implicit/no-abstract-role": "warn",
      "prefer-implicit/no-aria-on-non-semantic": "warn",
      "prefer-implicit/no-positive-tabindex": "warn",
    },
  },
];
```

## Rules

| Rule | Description | Fixable | Recommended |
| --- | --- | --- | --- |
| [no-redundant-role](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-redundant-role) | Disallow role attributes matching the element's implicit role | ✅ | warn |
| [no-destructive-role](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-destructive-role) | Disallow roles that remove native semantics | ✅ | warn |
| [no-conflicting-aria](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-conflicting-aria) | Disallow `aria-live` values conflicting with role semantics | ✅ | warn |
| [no-unsupported-aria](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-unsupported-aria) | Disallow ARIA attributes not supported by the element's role | ✅ | warn |
| [no-default-aria](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-default-aria) | Disallow ARIA attributes set to their default value | ✅ | warn |
| [no-hidden-focusable](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-hidden-focusable) | Disallow focusable elements with `aria-hidden="true"` | ✅ | warn |
| [no-invalid-role](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-invalid-role) | Detect invalid WAI-ARIA role values | ❌ | warn |
| [no-redundant-aria](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-redundant-aria) | Detect ARIA attributes repeating implicit element values | ✅ | warn |
| [no-abstract-role](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-abstract-role) | Disallow abstract ARIA roles | ❌ | warn |
| [no-aria-on-non-semantic](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-aria-on-non-semantic) | Warn on ARIA attributes on `role="none"`/`"presentation"` | ✅ | warn |
| [no-positive-tabindex](https://k9n-dev.github.io/eslint-plugin-prefer-implicit/rules/no-positive-tabindex) | Warn on `tabindex` > 0 | ❌ | warn |

## Core Philosophy

- ✅ Native HTML first
- ✅ Implicit semantics over explicit declarations
- ✅ Conservative autofix (only when 100% safe)
- ❌ No guessing developer intent
- ❌ No breaking dynamic behavior

## License

MIT
