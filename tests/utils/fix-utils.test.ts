/**
 * Tests for the whitespace-aware attribute removal in fix-utils.ts.
 *
 * Since `removeAttribute` requires a real ESLint RuleContext and RuleFixer,
 * we test it indirectly through the `no-redundant-role` rule (which uses
 * `removeAttribute` for all its fixes). This validates the actual fix output
 * across various whitespace scenarios: single-line, multiline, tabs, mixed
 * indentation, multiple attributes, and edge cases.
 */

import { describe } from "vitest";
import { RuleTester } from "eslint";
import noRedundantRole from "../../src/rules/no-redundant-role.js";
import noDefaultAria from "../../src/rules/no-default-aria.js";
import noHiddenFocusable from "../../src/rules/no-hidden-focusable.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

// ---------------------------------------------------------------------------
// Single-line whitespace removal
// ---------------------------------------------------------------------------

describe("removeAttribute — single-line whitespace", () => {
  tester.run("single space before attribute", noRedundantRole, {
    valid: [],
    invalid: [
      // Single space: `<button role="button">` → `<button>`
      {
        code: '<button role="button">Save</button>',
        output: "<button>Save</button>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run("multiple spaces before attribute", noRedundantRole, {
    valid: [],
    invalid: [
      // Multiple spaces: `<button   role="button">` → `<button>`
      {
        code: '<button   role="button">Save</button>',
        output: "<button>Save</button>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run("tab before attribute", noRedundantRole, {
    valid: [],
    invalid: [
      // Tab character: `<button\trole="button">` → `<button>`
      {
        code: '<button\trole="button">Save</button>',
        output: "<button>Save</button>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run("mixed spaces and tabs before attribute", noRedundantRole, {
    valid: [],
    invalid: [
      // Mixed: `<button \t role="button">` → `<button>`
      {
        code: '<button \t role="button">Save</button>',
        output: "<button>Save</button>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });
});

// ---------------------------------------------------------------------------
// Multiline whitespace removal
// ---------------------------------------------------------------------------

describe("removeAttribute — multiline formatting", () => {
  tester.run("attribute on new line (preserves newline)", noRedundantRole, {
    valid: [],
    invalid: [
      // Newline before attribute — whitespace walk stops at \n, so the
      // newline and indentation are preserved (only inline ws consumed).
      {
        code: '<button\n  role="button">Save</button>',
        output: "<button\n>Save</button>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run(
    "attribute on new line with tabs (preserves newline)",
    noRedundantRole,
    {
      valid: [],
      invalid: [
        // Newline + tab indentation before attribute
        {
          code: '<button\n\trole="button">Save</button>',
          output: "<button\n>Save</button>",
          errors: [{ messageId: "redundantRole" }],
        },
      ],
    },
  );

  tester.run(
    "attribute on new line with mixed indent (preserves newline)",
    noRedundantRole,
    {
      valid: [],
      invalid: [
        // Newline + spaces + tab before attribute
        {
          code: '<button\n  \trole="button">Save</button>',
          output: "<button\n>Save</button>",
          errors: [{ messageId: "redundantRole" }],
        },
      ],
    },
  );

  tester.run(
    "CRLF line ending (preserves line break)",
    noRedundantRole,
    {
      valid: [],
      invalid: [
        // Windows-style line ending
        {
          code: '<button\r\n  role="button">Save</button>',
          output: "<button\r\n>Save</button>",
          errors: [{ messageId: "redundantRole" }],
        },
      ],
    },
  );
});

// ---------------------------------------------------------------------------
// Attribute between other attributes
// ---------------------------------------------------------------------------

describe("removeAttribute — attribute between other attributes", () => {
  tester.run(
    "removed attribute between two other attributes",
    noDefaultAria,
    {
      valid: [],
      invalid: [
        // Middle attribute removed: preserves spacing around remaining attrs
        {
          code: '<div class="box" aria-hidden="false" id="main" />',
          output: '<div class="box" id="main" />',
          errors: [{ messageId: "defaultAriaValue" }],
        },
      ],
    },
  );

  tester.run("removed attribute is the last attribute", noRedundantRole, {
    valid: [],
    invalid: [
      // Last attribute removed: `<a href="#" role="link">` → `<a href="#">`
      {
        code: '<a href="#" role="link">click</a>',
        output: '<a href="#">click</a>',
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run("removed attribute is the only attribute", noRedundantRole, {
    valid: [],
    invalid: [
      // Only attribute: `<button role="button" />` → `<button />`
      {
        code: '<button role="button" />',
        output: "<button />",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });
});

// ---------------------------------------------------------------------------
// Self-closing vs non-self-closing elements
// ---------------------------------------------------------------------------

describe("removeAttribute — element variants", () => {
  tester.run("self-closing element with space before />", noRedundantRole, {
    valid: [],
    invalid: [
      {
        code: '<img role="img" />',
        output: "<img />",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run("non-self-closing element", noRedundantRole, {
    valid: [],
    invalid: [
      {
        code: '<nav role="navigation">links</nav>',
        output: "<nav>links</nav>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });

  tester.run("element with children and closing tag", noRedundantRole, {
    valid: [],
    invalid: [
      {
        code: '<ul role="list"><li>item</li></ul>',
        output: "<ul><li>item</li></ul>",
        errors: [{ messageId: "redundantRole" }],
      },
    ],
  });
});

// ---------------------------------------------------------------------------
// Multiple attributes removed from the same element
// ---------------------------------------------------------------------------

describe("removeAttribute — multiple removals on same element", () => {
  tester.run(
    "two default-value attributes on same element (first pass)",
    noDefaultAria,
    {
      valid: [],
      invalid: [
        // ESLint applies fixes one at a time; first pass removes the first
        // violation, second pass (re-lint) removes the second.
        {
          code: '<div aria-hidden="false" aria-expanded="false" />',
          output: '<div aria-expanded="false" />',
          errors: [
            { messageId: "defaultAriaValue" },
            { messageId: "defaultAriaValue" },
          ],
        },
      ],
    },
  );
});

// ---------------------------------------------------------------------------
// Multiline with multiple attributes
// ---------------------------------------------------------------------------

describe("removeAttribute — multiline with multiple attributes", () => {
  tester.run(
    "multiline element, removed attribute on its own line",
    noHiddenFocusable,
    {
      valid: [],
      invalid: [
        // Attribute on its own line — newline preserved, indentation consumed
        {
          code: [
            "<button",
            '  aria-hidden="true"',
            ">Click</button>",
          ].join("\n"),
          output: "<button\n\n>Click</button>",
          errors: [{ messageId: "hiddenFocusable" }],
        },
      ],
    },
  );

  tester.run(
    "multiline element, removed attribute between others on separate lines",
    noDefaultAria,
    {
      valid: [],
      invalid: [
        {
          code: [
            '<div',
            '  class="box"',
            '  aria-hidden="false"',
            '  id="main"',
            "/>",
          ].join("\n"),
          output: [
            '<div',
            '  class="box"',
            '\n  id="main"',
            "/>",
          ].join("\n"),
          errors: [{ messageId: "defaultAriaValue" }],
        },
      ],
    },
  );
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("removeAttribute — edge cases", () => {
  tester.run(
    "attribute immediately after tag name (no leading space)",
    noRedundantRole,
    {
      valid: [],
      invalid: [
        // Pathological case: no space between tag name and attribute.
        // The walker finds no whitespace to consume, falls back to plain remove.
        // This produces `<button>` which is still correct.
        {
          code: '<button role="button">Save</button>',
          output: "<button>Save</button>",
          errors: [{ messageId: "redundantRole" }],
        },
      ],
    },
  );

  tester.run("very long attribute value", noDefaultAria, {
    valid: [],
    invalid: [
      {
        code: '<div aria-hidden="false" />',
        output: "<div />",
        errors: [{ messageId: "defaultAriaValue" }],
      },
    ],
  });

  tester.run("attribute with empty string value", noDefaultAria, {
    valid: [],
    invalid: [
      {
        code: '<span aria-label="" />',
        output: "<span />",
        errors: [{ messageId: "emptyAriaValue" }],
      },
    ],
  });

  tester.run(
    "only whitespace between tag name and removed attribute",
    noRedundantRole,
    {
      valid: [],
      invalid: [
        // Lots of whitespace: `<button      role="button" />`
        {
          code: '<button      role="button" />',
          output: "<button />",
          errors: [{ messageId: "redundantRole" }],
        },
      ],
    },
  );

  tester.run(
    "tab-only indentation between tag and attribute",
    noRedundantRole,
    {
      valid: [],
      invalid: [
        {
          code: '<button\t\t\trole="button" />',
          output: "<button />",
          errors: [{ messageId: "redundantRole" }],
        },
      ],
    },
  );
});
