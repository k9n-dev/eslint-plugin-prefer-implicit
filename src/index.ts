import type { ESLint } from "eslint";

import noRedundantRole from "./rules/no-redundant-role.js";
import noDestructiveRole from "./rules/no-destructive-role.js";
import noConflictingAria from "./rules/no-conflicting-aria.js";
import noUnsupportedAria from "./rules/no-unsupported-aria.js";
import noDefaultAria from "./rules/no-default-aria.js";
import noHiddenFocusable from "./rules/no-hidden-focusable.js";

const plugin: ESLint.Plugin = {
  meta: {
    name: "eslint-plugin-prefer-implicit",
    version: "0.1.0",
  },
  rules: {
    "no-redundant-role": noRedundantRole,
    "no-destructive-role": noDestructiveRole,
    "no-conflicting-aria": noConflictingAria,
    "no-unsupported-aria": noUnsupportedAria,
    "no-default-aria": noDefaultAria,
    "no-hidden-focusable": noHiddenFocusable,
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
  },
};

export default plugin;
