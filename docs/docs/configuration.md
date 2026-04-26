# Configuration

## Recommended Config

The recommended config enables all six rules at `"warn"` severity:

```js title="eslint.config.js"
import preferImplicit from "@k9n/eslint-plugin-prefer-implicit";

export default [preferImplicit.configs.recommended];
```

## Manual Configuration

You can configure individual rules and their severity:

```js title="eslint.config.js"
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

## Static vs Dynamic Detection

Autofix is only applied for **static** attribute values. Dynamic bindings are detected and skipped to avoid breaking runtime behavior.

| Case | Example | Behavior |
| --- | --- | --- |
| Static | `aria-hidden="true"` | Analyzed and fixed |
| Vue binding | `:aria-hidden="isHidden"` | Skipped |
| JSX expression | `aria-hidden={condition}` | Skipped |
| Angular binding | `[aria-hidden]="isHidden"` | Skipped |
