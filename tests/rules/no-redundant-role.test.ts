import { RuleTester } from "eslint";
import rule from "../../src/rules/no-redundant-role.js";

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

tester.run("no-redundant-role", rule, {
  // ---------------------------------------------------------------------------
  // Valid cases — should NOT trigger the rule
  // ---------------------------------------------------------------------------
  valid: [
    // Different role than implicit (Req 3.8)
    { code: "<button role='link' />" },
    { code: "<nav role='banner' />" },
    { code: "<ul role='tablist' />" },
    { code: "<li role='tab' />" },
    { code: "<table role='grid' />" },

    // Dynamic role value — should be skipped (Req 3.7)
    { code: "<button role={dynamicRole} />" },
    { code: "<nav role={getRole()} />" },

    // Element with no implicit role — div has no implicit role of "button"
    { code: '<div role="button" />' },
    { code: '<span role="link" />' },

    // Element not in IMPLICIT_ROLE_MAP at all
    { code: '<p role="note" />' },

    // Conditional implicit role: <a> without href has no implicit role
    { code: '<a role="link" />' },

    // Component names are skipped (not HTML elements)
    { code: '<MyButton role="button" />' },

    // No role attribute at all
    { code: "<button />" },
    { code: "<nav>content</nav>" },
  ],

  // ---------------------------------------------------------------------------
  // Invalid cases — should trigger the rule with autofix
  // ---------------------------------------------------------------------------
  invalid: [
    // Req 3.1: <button role="button"> is redundant
    {
      code: '<button role="button" />',
      output: "<button />",
      errors: [{ messageId: "redundantRole" }],
    },
    // Req 3.2: <nav role="navigation"> is redundant
    {
      code: '<nav role="navigation">links</nav>',
      output: "<nav>links</nav>",
      errors: [{ messageId: "redundantRole" }],
    },
    // Req 3.3: <ul role="list"> is redundant
    {
      code: '<ul role="list"><li>item</li></ul>',
      output: "<ul><li>item</li></ul>",
      errors: [{ messageId: "redundantRole" }],
    },
    // Req 3.4: <li role="listitem"> is redundant
    {
      code: '<li role="listitem">item</li>',
      output: "<li>item</li>",
      errors: [{ messageId: "redundantRole" }],
    },
    // Req 3.5: <table role="table"> is redundant
    {
      code: '<table role="table"><tr><td>cell</td></tr></table>',
      output: "<table><tr><td>cell</td></tr></table>",
      errors: [{ messageId: "redundantRole" }],
    },

    // Additional implicit role matches from the map
    {
      code: '<header role="banner">site header</header>',
      output: "<header>site header</header>",
      errors: [{ messageId: "redundantRole" }],
    },
    {
      code: '<footer role="contentinfo">site footer</footer>',
      output: "<footer>site footer</footer>",
      errors: [{ messageId: "redundantRole" }],
    },
    {
      code: '<main role="main">content</main>',
      output: "<main>content</main>",
      errors: [{ messageId: "redundantRole" }],
    },
    {
      code: '<form role="form">fields</form>',
      output: "<form>fields</form>",
      errors: [{ messageId: "redundantRole" }],
    },
    {
      code: '<h1 role="heading">Title</h1>',
      output: "<h1>Title</h1>",
      errors: [{ messageId: "redundantRole" }],
    },
    {
      code: '<img role="img" />',
      output: "<img />",
      errors: [{ messageId: "redundantRole" }],
    },
    {
      code: '<aside role="complementary">sidebar</aside>',
      output: "<aside>sidebar</aside>",
      errors: [{ messageId: "redundantRole" }],
    },

    // Conditional implicit role: <a> with href has implicit role "link"
    {
      code: '<a href="#" role="link">click</a>',
      output: '<a href="#">click</a>',
      errors: [{ messageId: "redundantRole" }],
    },

    // Req 3.6: Autofix removes the role attribute (verified by output)
    // <ol role="list"> is redundant
    {
      code: '<ol role="list"><li>one</li></ol>',
      output: "<ol><li>one</li></ol>",
      errors: [{ messageId: "redundantRole" }],
    },
  ],
});
