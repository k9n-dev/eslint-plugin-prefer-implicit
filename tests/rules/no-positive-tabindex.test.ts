import { RuleTester } from "eslint";
import rule from "../../src/rules/no-positive-tabindex.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-positive-tabindex", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // tabindex="0" — allowed (Req 5.2)
    { code: '<div tabindex="0" />' },

    // tabindex="-1" — allowed (Req 5.2)
    { code: '<div tabindex="-1" />' },

    // No tabindex attribute at all
    { code: "<div />" },

    // Non-numeric tabindex — should be skipped (Req 5.4)
    { code: '<div tabindex="abc" />' },

    // Dynamic tabindex — should be skipped (Req 5.3)
    { code: "<div tabindex={index} />" },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule (Req 5.1)
  // ---------------------------------------------------------------------------
  invalid: [
    {
      code: '<button tabindex="1" />',
      errors: [{ messageId: "positiveTabindex", data: { value: "1" } }],
    },
    {
      code: '<div tabindex="5" />',
      errors: [{ messageId: "positiveTabindex", data: { value: "5" } }],
    },
    {
      code: '<input tabindex="99" />',
      errors: [{ messageId: "positiveTabindex", data: { value: "99" } }],
    },
  ],
});
