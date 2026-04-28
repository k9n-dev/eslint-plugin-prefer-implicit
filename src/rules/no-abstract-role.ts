/**
 * Rule: no-abstract-role
 *
 * Disallow abstract WAI-ARIA roles. Abstract roles exist only as ontological
 * superclasses in the ARIA taxonomy and must not be used by content authors.
 */

import type { Rule } from "eslint";
import { ABSTRACT_ROLES } from "../utils/aria-data.js";
import {
  getStaticAttributeValue,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";

/**
 * Checks an element node for abstract role attribute values and reports
 * a violation if the role is one of the 12 abstract WAI-ARIA roles.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const role = getStaticAttributeValue(node, "role");
  if (role === null) return;

  if (ABSTRACT_ROLES.has(role.toLowerCase())) {
    const attrNode = getAttributeNode(node, "role");
    context.report({
      node: attrNode ?? node,
      messageId: "abstractRole",
      data: { role },
    });
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow abstract WAI-ARIA roles that must not be used by content authors",
    },
    schema: [],
    messages: {
      abstractRole:
        'The role "{{role}}" is an abstract role and must not be used by content authors.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
