import { RuleTester } from "eslint";
import rule from "../../src/rules/no-destructive-role.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-destructive-role", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Non-interactive, non-structural element with role="none" (Req 4.1–4.3)
    { code: '<div role="none" />' },
    { code: '<span role="presentation" />' },
    { code: '<p role="none" />' },

    // <a> without href is not interactive — should be allowed (Req 4.2)
    { code: '<a role="presentation">link text</a>' },
    { code: '<a role="none">link text</a>' },

    // Dynamic role value — should be skipped (Req 4.5)
    { code: "<button role={dynamicRole} />" },
    { code: "<a href='#' role={getRole()} />" },
    { code: "<ul role={condition ? 'none' : 'list'} />" },

    // No role attribute at all
    { code: "<button />" },
    { code: "<ul><li>item</li></ul>" },

    // Interactive element with a non-destructive role
    { code: '<button role="link" />' },
    { code: '<a href="#" role="button">click</a>' },
    { code: '<input role="searchbox" />' },

    // Structural element with a non-destructive role
    { code: '<ul role="tablist" />' },
    { code: '<table role="grid" />' },
    { code: '<li role="tab" />' },

    // Component names are skipped (not HTML elements)
    { code: '<MyButton role="none" />' },
    { code: '<CustomList role="presentation" />' },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix
  // ---------------------------------------------------------------------------
  invalid: [
    // Req 4.1: <button role="none"> is destructive
    {
      code: '<button role="none" />',
      output: "<button />",
      errors: [{ messageId: "destructiveRole" }],
    },
    // <button role="presentation"> is also destructive
    {
      code: '<button role="presentation" />',
      output: "<button />",
      errors: [{ messageId: "destructiveRole" }],
    },

    // Req 4.2: <a href="#" role="presentation"> is destructive
    {
      code: '<a href="#" role="presentation">click</a>',
      output: '<a href="#">click</a>',
      errors: [{ messageId: "destructiveRole" }],
    },
    // <a href="#" role="none"> is also destructive
    {
      code: '<a href="#" role="none">click</a>',
      output: '<a href="#">click</a>',
      errors: [{ messageId: "destructiveRole" }],
    },

    // Req 4.3: <ul role="presentation"> is destructive (structural element)
    {
      code: '<ul role="presentation"><li>item</li></ul>',
      output: "<ul><li>item</li></ul>",
      errors: [{ messageId: "destructiveRole" }],
    },
    // <ul role="none"> is also destructive
    {
      code: '<ul role="none"><li>item</li></ul>',
      output: "<ul><li>item</li></ul>",
      errors: [{ messageId: "destructiveRole" }],
    },

    // Additional interactive elements
    {
      code: '<input role="none" />',
      output: "<input />",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<select role="presentation" />',
      output: "<select />",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<textarea role="none" />',
      output: "<textarea />",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<summary role="presentation">details</summary>',
      output: "<summary>details</summary>",
      errors: [{ messageId: "destructiveRole" }],
    },

    // Additional structural elements
    {
      code: '<ol role="none"><li>one</li></ol>',
      output: "<ol><li>one</li></ol>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<li role="presentation">item</li>',
      output: "<li>item</li>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<table role="none"><tr><td>cell</td></tr></table>',
      output: "<table><tr><td>cell</td></tr></table>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<tr role="presentation"><td>cell</td></tr>',
      output: "<tr><td>cell</td></tr>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<td role="none">cell</td>',
      output: "<td>cell</td>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<th role="presentation">header</th>',
      output: "<th>header</th>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<menu role="none"><li>item</li></menu>',
      output: "<menu><li>item</li></menu>",
      errors: [{ messageId: "destructiveRole" }],
    },
    {
      code: '<dl role="presentation"><dt>term</dt><dd>def</dd></dl>',
      output: "<dl><dt>term</dt><dd>def</dd></dl>",
      errors: [{ messageId: "destructiveRole" }],
    },
  ],
});
