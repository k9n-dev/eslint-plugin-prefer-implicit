import { RuleTester } from "eslint";
import rule from "../../src/rules/no-invalid-role.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-invalid-role", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Valid concrete roles (Req 1.2)
    { code: '<div role="button" />' },
    { code: '<div role="link" />' },
    { code: '<div role="navigation" />' },

    // Case-insensitive matching (Req 1.4)
    { code: '<div role="BUTTON" />' },
    { code: '<div role="Link" />' },

    // Multiple valid roles
    { code: '<div role="button link" />' },

    // No role attribute at all
    { code: "<div />" },

    // Dynamic role value — should be skipped (Req 1.3)
    { code: "<div role={dynamicRole} />" },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule
  // ---------------------------------------------------------------------------
  invalid: [
    // Typo: "buton" (Req 1.1)
    {
      code: '<div role="buton" />',
      errors: [{ messageId: "invalidRole", data: { role: "buton" } }],
    },
    // Typo: "buttn"
    {
      code: '<div role="buttn" />',
      errors: [{ messageId: "invalidRole", data: { role: "buttn" } }],
    },
    // Invented role (Req 1.1)
    {
      code: '<div role="superwidget" />',
      errors: [{ messageId: "invalidRole", data: { role: "superwidget" } }],
    },
    // Multiple tokens: one valid, one invalid — report only for "invalid" (Req 1.6)
    {
      code: '<div role="button invalid" />',
      errors: [{ messageId: "invalidRole", data: { role: "invalid" } }],
    },
    // Multiple tokens: both invalid — report twice (Req 1.6)
    {
      code: '<div role="foo bar" />',
      errors: [
        { messageId: "invalidRole", data: { role: "foo" } },
        { messageId: "invalidRole", data: { role: "bar" } },
      ],
    },
  ],
});
