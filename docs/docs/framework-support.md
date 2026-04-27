import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Framework Support

This plugin works with multiple frameworks and template syntaxes by operating on AST nodes provided by the respective parsers. It does not parse templates itself.

## Supported Frameworks

### JSX / React

Works out of the box with ESLint's built-in JSX support. The plugin listens for `JSXOpeningElement` nodes.

<Tabs>
<TabItem value="esm" label="ESM (import)" default>

```js title="eslint.config.js"
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
  {
    files: ["**/*.tsx"],
    ...preferImplicit.configs.recommended,
  },
];
```

</TabItem>
<TabItem value="cjs" label="CommonJS (require)">

```js title="eslint.config.js"
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = [
  {
    files: ["**/*.tsx"],
    ...preferImplicit.default.configs.recommended,
  },
];
```

</TabItem>
</Tabs>

#### Full React Example

A complete ESLint configuration for a React + TypeScript project:

```js title="eslint.config.mjs"
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "@typescript-eslint": typescriptPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // your project rules...
    },
  },
  {
    files: ["**/*.tsx"],
    ...preferImplicit.configs.recommended,
  },
];
```

### Vue

Works with `vue-eslint-parser` for `.vue` single-file component templates. The plugin uses `defineTemplateBodyVisitor` from `vue-eslint-parser` to traverse `VElement` nodes in the `<template>` section.

<Tabs>
<TabItem value="esm" label="ESM (import)" default>

```js title="eslint.config.ts"
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
  // ... your existing Vue config
  {
    files: ["**/*.vue"],
    ...preferImplicit.configs.recommended,
  },
];
```

</TabItem>
<TabItem value="cjs" label="CommonJS (require)">

```js title="eslint.config.js"
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = [
  // ... your existing Vue config
  {
    files: ["**/*.vue"],
    ...preferImplicit.default.configs.recommended,
  },
];
```

</TabItem>
</Tabs>

:::info
The Vue parser must already be configured in your ESLint setup (typically via `eslint-plugin-vue`). The plugin detects `defineTemplateBodyVisitor` automatically and uses it to traverse template nodes.
:::

#### Full Vue Example

A complete ESLint configuration for a Vue 3 + TypeScript project using `@vue/eslint-config-typescript`:

```ts title="eslint.config.ts"
import pluginVue from "eslint-plugin-vue";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/coverage/**"],
  },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    files: ["**/*.vue"],
    ...preferImplicit.configs.recommended,
  },
);
```

### Angular

Works with `@angular-eslint/template-parser` for Angular template syntax. The plugin listens for `Element` nodes produced by the Angular template parser and handles `TextAttribute` (static) and `BoundAttribute` (dynamic) nodes.

<Tabs>
<TabItem value="cjs" label="CommonJS (require)" default>

```js title="eslint.config.js"
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

</TabItem>
<TabItem value="esm" label="ESM (import)">

```js title="eslint.config.js"
import angular from "angular-eslint";
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [
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
    ...preferImplicit.configs.recommended,
  },
];
```

</TabItem>
</Tabs>

:::info
The Angular template parser must already be configured in your ESLint setup (typically via `angular-eslint`). The plugin config should be added as a **separate config object** after the Angular template config to avoid overriding the parser setup.
:::

#### Full Angular Example

A complete ESLint configuration for an Angular project:

```js title="eslint.config.js"
// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const preferImplicit = require("@k9n/eslint-plugin-prefer-implicit");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // your TypeScript rules...
    },
  },
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
);
```

### Plain HTML

Works with HTML ESLint parsers for static HTML files.

## Dynamic Value Detection

The plugin automatically detects dynamic bindings across all frameworks and skips them to avoid false positives:

| Framework | Dynamic Syntax | Behavior |
| --- | --- | --- |
| JSX | `aria-hidden={condition}` | Skipped |
| Vue | `:aria-hidden="isHidden"` | Skipped |
| Angular | `[aria-hidden]="isHidden"` | Skipped |
| HTML | `aria-hidden="false"` (static) | Analyzed |

## Parser Compatibility

The plugin uses a parser-agnostic approach to read element names and attribute values. It supports the following AST shapes:

| Parser | Element Node | Attribute Node | Static Value | Dynamic Value |
| --- | --- | --- | --- | --- |
| ESLint (JSX) | `JSXOpeningElement` | `JSXAttribute` | `Literal` | `JSXExpressionContainer` |
| vue-eslint-parser | `VElement` | `VAttribute` | `VLiteral` | `directive: true` |
| @angular-eslint/template-parser | `Element` | `TextAttribute` | `value` string | `BoundAttribute` |
