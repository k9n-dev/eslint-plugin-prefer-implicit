# @k9n/eslint-plugin-prefer-implicit

## 0.3.0

### Minor Changes

- [`d6cfbf6`](https://github.com/k9n-dev/eslint-plugin-prefer-implicit/commit/d6cfbf6ad54971e6c661100e0cabba7ba74db7b8) Thanks [@d-koppenhagen](https://github.com/d-koppenhagen)! - Added five new ESLint rules:

  - `no-invalid-role`: Detect invalid WAI-ARIA role values (typos, invented roles)
  - `no-redundant-aria`: Detect ARIA attributes repeating implicit element values (fixable)
  - `no-abstract-role`: Disallow abstract ARIA roles not intended for content authors
  - `no-aria-on-non-semantic`: Warn on ARIA attributes on `role="none"`/`"presentation"` elements (fixable)
  - `no-positive-tabindex`: Warn on `tabindex` > 0 disrupting natural tab order

## 0.2.2

### Patch Changes

- [`ffb80e3`](https://github.com/k9n-dev/eslint-plugin-prefer-implicit/commit/ffb80e3ae00edea8045b2e5c91d9a38d353b4d2e) Thanks [@d-koppenhagen](https://github.com/d-koppenhagen)! - chore: dynamically load version from package.json

## 0.2.1

### Patch Changes

- [#1](https://github.com/k9n-dev/eslint-plugin-prefer-implicit/pull/1) [`96d97fc`](https://github.com/k9n-dev/eslint-plugin-prefer-implicit/commit/96d97fc35f4ab5218241df7cc9f9381e6836bd98) Thanks [@d-koppenhagen](https://github.com/d-koppenhagen)! - chore: add automated release workflow with changesets

## 0.2.0

### Minor Changes

- feat: introduce whitespace-aware attribute removal

### Patch Changes

- fix: expand framework support for vue and angular

## 0.1.3

### Patch Changes

- fix: add support for CommonJS

## 0.1.2

### Patch Changes

- fix: include README, LICENSE, and CHANGELOG in published package

## 0.1.1

### Patch Changes

- fix: set correct homepage URL
