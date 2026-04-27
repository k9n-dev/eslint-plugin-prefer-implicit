/**
 * Rule: no-destructive-role
 *
 * Disallow role attributes that remove the native semantics of interactive
 * or structural elements. For example, `<button role="none">` strips the
 * button's implicit semantics, which is almost always a mistake.
 */

import type { Rule } from "eslint";
import {
  INTERACTIVE_ELEMENTS,
  STRUCTURAL_ELEMENTS,
  DESTRUCTIVE_ROLES,
} from "../utils/aria-data.js";
import {
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
  getAttributeNode,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";

/**
 * Checks an element node for a destructive role attribute and reports
 * a violation if the element is interactive or structural and the role
 * strips its native semantics.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const elementName = getElementName(node);
  if (elementName === null) return;

  // Determine if the element is interactive or structural.
  const isInteractive = INTERACTIVE_ELEMENTS.has(elementName);
  const isStructural = STRUCTURAL_ELEMENTS.has(elementName);

  if (!isInteractive && !isStructural) return;

  // For <a>, only flag if href is present (without href it's not interactive).
  if (elementName === "a" && !hasAttribute(node, "href")) {
    return;
  }

  const role = getStaticAttributeValue(node, "role");
  // Skip dynamic or missing role values.
  if (role === null) return;

  if (DESTRUCTIVE_ROLES.has(role.toLowerCase())) {
    const attrNode = getAttributeNode(node, "role");
    context.report({
      node: attrNode ?? node,
      messageId: "destructiveRole",
      data: { element: elementName, role },
      fix(fixer) {
        if (attrNode) {
          return fixer.remove(attrNode);
        }
        return null;
      },
    });
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow role attributes that remove the native semantics of interactive or structural elements",
    },
    fixable: "code",
    schema: [],
    messages: {
      destructiveRole:
        'The role "{{role}}" removes the native semantics of <{{element}}>. Remove the destructive role attribute.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
