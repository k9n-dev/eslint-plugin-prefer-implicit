import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Started

**@k9n/eslint-plugin-prefer-implicit** is an ESLint plugin that enforces implicit HTML semantics over explicit ARIA attributes and roles.

> **If the browser already knows it, don't repeat it.**

## Motivation

Modern HTML already provides rich, implicit semantics. However, many codebases add redundant or even harmful ARIA attributes and roles. This plugin helps you:

- Reduce unnecessary ARIA usage
- Remove redundant or conflicting roles
- Encourage native HTML semantics
- Prevent accessibility regressions caused by overengineering

## Installation

```bash
npm install --save-dev @k9n/eslint-plugin-prefer-implicit
```

:::info
This plugin requires **ESLint ^10.0.0** with flat config.
:::

## Quick Setup

Use the recommended config to enable all six rules at `"warn"` severity:

<Tabs>
<TabItem value="esm" label="ESM (import)" default>

```js title="eslint.config.js"
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [preferImplicit.configs.recommended];
```

</TabItem>
<TabItem value="cjs" label="CommonJS (require)">

```js title="eslint.config.js"
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = [preferImplicit.default.configs.recommended];
```

</TabItem>
</Tabs>

That's it! See [Configuration](./configuration) for more options.

## Rules Overview

| Rule | Description | Fixable |
| --- | --- | :---: |
| [no-redundant-role](./rules/no-redundant-role) | Disallow role attributes that match the element's implicit ARIA role | ✅ |
| [no-destructive-role](./rules/no-destructive-role) | Disallow role attributes that remove native semantics of interactive or structural elements | ✅ |
| [no-conflicting-aria](./rules/no-conflicting-aria) | Disallow `aria-live` values that conflict with the implicit live region behavior of a declared role | ✅ |
| [no-unsupported-aria](./rules/no-unsupported-aria) | Disallow ARIA attributes not supported by the element's role | ✅ |
| [no-default-aria](./rules/no-default-aria) | Disallow ARIA attributes set to their default value or empty string | ✅ |
| [no-hidden-focusable](./rules/no-hidden-focusable) | Disallow elements that are both focusable and `aria-hidden="true"` | ✅ |

## Core Philosophy

- ✅ Native HTML first
- ✅ Implicit semantics over explicit declarations
- ✅ Conservative autofix (only when 100% safe)
- ❌ No guessing developer intent
- ❌ No breaking dynamic behavior
