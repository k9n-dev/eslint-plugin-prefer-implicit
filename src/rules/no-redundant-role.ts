/**
 * Rule: no-redundant-role
 *
 * Disallow role attributes that match the element's implicit ARIA role.
 * For example, `<button role="button">` is redundant because `<button>`
 * already has an implicit role of "button".
 */

import type { Rule } from "eslint";
import { IMPLICIT_ROLE_MAP } from "../utils/aria-data.js";
import {
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
  getAttributeNode,
} from "../utils/attribute-utils.js";

/**
 * Checks an element node for a redundant role attribute and reports
 * a violation if the explicit role matches the element's implicit role.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const elementName = getElementName(node);
  if (elementName === null) return;

  const entry = IMPLICIT_ROLE_MAP[elementName];
  if (!entry) return;

  // If the implicit role is conditional (e.g. <a> requires href),
  // verify the condition is met before flagging.
  if (entry.condition) {
    if (!hasAttribute(node, entry.condition.attribute)) {
      return;
    }
  }

  const role = getStaticAttributeValue(node, "role");
  if (role === null) return;

  if (role.toLowerCase() === entry.role) {
    const attrNode = getAttributeNode(node, "role");
    context.report({
      node: attrNode ?? node,
      messageId: "redundantRole",
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
        "Disallow role attributes that match the element's implicit ARIA role",
    },
    fixable: "code",
    schema: [],
    messages: {
      redundantRole:
        'The role "{{role}}" is the implicit role of <{{element}}>. Remove the redundant role attribute.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node: any) {
        checkElement(context, node);
      },
      VElement(node: any) {
        checkElement(context, node);
      },
    };
  },
};

export default rule;
