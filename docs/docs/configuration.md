import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configuration

## Recommended Config

The recommended config enables all six rules at `"warn"` severity:

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

## Manual Configuration

You can configure individual rules and their severity:

<Tabs>
<TabItem value="esm" label="ESM (import)" default>

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

</TabItem>
<TabItem value="cjs" label="CommonJS (require)">

```js title="eslint.config.js"
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

</TabItem>
</Tabs>

## Static vs Dynamic Detection

Autofix is only applied for **static** attribute values. Dynamic bindings are detected and skipped to avoid breaking runtime behavior.

| Case | Example | Behavior |
| --- | --- | --- |
| Static | `aria-hidden="true"` | Analyzed and fixed |
| Vue binding | `:aria-hidden="isHidden"` | Skipped |
| JSX expression | `aria-hidden={condition}` | Skipped |
| Angular binding | `[aria-hidden]="isHidden"` | Skipped |
