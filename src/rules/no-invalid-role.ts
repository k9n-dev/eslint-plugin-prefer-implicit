/**
 * Rule: no-invalid-role
 *
 * Disallow invalid WAI-ARIA role values. Detects typos and invented roles
 * by checking each role token against the set of valid ARIA roles.
 */

import type { Rule } from "eslint";
import { VALID_ARIA_ROLES } from "../utils/aria-data.js";
import {
  getStaticAttributeValue,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";

/**
 * Checks an element node for invalid role attribute values and reports
 * a violation for each token that is not a valid WAI-ARIA role.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const role = getStaticAttributeValue(node, "role");
  if (role === null) return;

  const tokens = role.split(/\s+/);

  for (const token of tokens) {
    if (token === "") continue;

    if (!VALID_ARIA_ROLES.has(token.toLowerCase())) {
      const attrNode = getAttributeNode(node, "role");
      context.report({
        node: attrNode ?? node,
        messageId: "invalidRole",
        data: { role: token },
      });
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow invalid WAI-ARIA role values (typos, invented roles)",
    },
    schema: [],
    messages: {
      invalidRole:
        'The role "{{role}}" is not a valid WAI-ARIA role.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
