# Framework Support

This plugin works with multiple frameworks and template syntaxes by operating on AST nodes provided by the respective parsers. It does not parse templates itself.

## Supported Frameworks

### JSX / React

Works out of the box with ESLint's built-in JSX support.

```js title="eslint.config.js"
import preferImplicit from "eslint-plugin-prefer-implicit";

export default [
  {
    ...preferImplicit.configs.recommended,
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
];
```

### Vue

Works with `vue-eslint-parser` for `.vue` single-file component templates.

```js title="eslint.config.js"
import preferImplicit from "eslint-plugin-prefer-implicit";
import vueParser from "vue-eslint-parser";

export default [
  {
    ...preferImplicit.configs.recommended,
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
    },
  },
];
```

### Angular

Works with `angular-eslint` for Angular template syntax.

```js title="eslint.config.js"
import preferImplicit from "eslint-plugin-prefer-implicit";

// Use alongside your angular-eslint configuration
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
