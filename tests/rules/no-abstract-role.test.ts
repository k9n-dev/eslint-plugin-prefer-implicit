import { RuleTester } from "eslint";
import rule from "../../src/rules/no-abstract-role.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-abstract-role", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Concrete roles (Req 3.2)
    { code: '<div role="button" />' },
    { code: '<div role="link" />' },
    { code: '<div role="alert" />' },
    { code: '<div role="navigation" />' },

    // No role attribute at all
    { code: "<div />" },

    // Dynamic role value — should be skipped (Req 3.3)
    { code: "<div role={dynamicRole} />" },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — all 12 abstract roles (Req 3.1, 3.4)
  // ---------------------------------------------------------------------------
  invalid: [
    {
      code: '<div role="widget" />',
      errors: [{ messageId: "abstractRole", data: { role: "widget" } }],
    },
    {
      code: '<div role="landmark" />',
      errors: [{ messageId: "abstractRole", data: { role: "landmark" } }],
    },
    {
      code: '<div role="roletype" />',
      errors: [{ messageId: "abstractRole", data: { role: "roletype" } }],
    },
    {
      code: '<div role="structure" />',
      errors: [{ messageId: "abstractRole", data: { role: "structure" } }],
    },
    {
      code: '<div role="input" />',
      errors: [{ messageId: "abstractRole", data: { role: "input" } }],
    },
    {
      code: '<div role="command" />',
      errors: [{ messageId: "abstractRole", data: { role: "command" } }],
    },
    {
      code: '<div role="composite" />',
      errors: [{ messageId: "abstractRole", data: { role: "composite" } }],
    },
    {
      code: '<div role="range" />',
      errors: [{ messageId: "abstractRole", data: { role: "range" } }],
    },
    {
      code: '<div role="section" />',
      errors: [{ messageId: "abstractRole", data: { role: "section" } }],
    },
    {
      code: '<div role="sectionhead" />',
      errors: [{ messageId: "abstractRole", data: { role: "sectionhead" } }],
    },
    {
      code: '<div role="select" />',
      errors: [{ messageId: "abstractRole", data: { role: "select" } }],
    },
    {
      code: '<div role="window" />',
      errors: [{ messageId: "abstractRole", data: { role: "window" } }],
    },
  ],
});
