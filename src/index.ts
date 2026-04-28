import { createRequire } from "node:module";
import type { ESLint } from "eslint";

import noRedundantRole from "./rules/no-redundant-role.js";
import noDestructiveRole from "./rules/no-destructive-role.js";
import noConflictingAria from "./rules/no-conflicting-aria.js";
import noUnsupportedAria from "./rules/no-unsupported-aria.js";
import noDefaultAria from "./rules/no-default-aria.js";
import noHiddenFocusable from "./rules/no-hidden-focusable.js";
import noInvalidRole from "./rules/no-invalid-role.js";
import noRedundantAria from "./rules/no-redundant-aria.js";
import noAbstractRole from "./rules/no-abstract-role.js";
import noAriaOnNonSemantic from "./rules/no-aria-on-non-semantic.js";
import noPositiveTabindex from "./rules/no-positive-tabindex.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const plugin: ESLint.Plugin = {
  meta: {
    name: "@k9n/eslint-plugin-prefer-implicit",
    version,
  },
  rules: {
    "no-redundant-role": noRedundantRole,
    "no-destructive-role": noDestructiveRole,
    "no-conflicting-aria": noConflictingAria,
    "no-unsupported-aria": noUnsupportedAria,
    "no-default-aria": noDefaultAria,
    "no-hidden-focusable": noHiddenFocusable,
    "no-invalid-role": noInvalidRole,
    "no-redundant-aria": noRedundantAria,
    "no-abstract-role": noAbstractRole,
    "no-aria-on-non-semantic": noAriaOnNonSemantic,
    "no-positive-tabindex": noPositiveTabindex,
  },
  configs: {},
};

// Attach recommended config after plugin is defined (self-reference)
plugin.configs!.recommended = {
  plugins: {
    "prefer-implicit": plugin,
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
};

export default plugin;
