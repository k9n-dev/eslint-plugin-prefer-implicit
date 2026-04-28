/**
 * Rule: no-aria-on-non-semantic
 *
 * Disallow ARIA attributes on elements with `role="none"` or
 * `role="presentation"`. These roles strip native semantics from an element,
 * so any `aria-*` attributes have no effect and should be removed.
 */

import type { Rule } from "eslint";
import { DESTRUCTIVE_ROLES } from "../utils/aria-data.js";
import {
  getStaticAttributeValue,
  getAttributeNode,
  isDynamicValue,
} from "../utils/attribute-utils.js";
import { createElementVisitors } from "../utils/create-visitors.js";
import { removeAttribute } from "../utils/fix-utils.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Collects all `aria-*` attributes from an element node, returning each
 * attribute's name and its raw AST node. Works across JSX, Vue, and generic
 * HTML/Angular AST shapes.
 */
function getAriaAttributes(
  node: any,
): Array<{ name: string; attrNode: any }> {
  const result: Array<{ name: string; attrNode: any }> = [];
  let attrs: any[] = [];

  if (node.type === "JSXOpeningElement" && Array.isArray(node.attributes)) {
    attrs = node.attributes;
  } else if (node.type === "VElement" && node.startTag?.attributes) {
    attrs = node.startTag.attributes;
  } else if (Array.isArray(node.attributes)) {
    attrs = node.attributes;
  }

  for (const attr of attrs) {
    let name: string | null = null;

    if (attr.type === "JSXAttribute" && attr.name?.name) {
      name = typeof attr.name.name === "string" ? attr.name.name : null;
    } else if (attr.type === "VAttribute" && attr.key?.name) {
      name = typeof attr.key.name === "string" ? attr.key.name : null;
    } else if (typeof attr.name === "string") {
      name = attr.name;
    }

    if (name && name.startsWith("aria-")) {
      result.push({ name, attrNode: attr });
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

/**
 * Checks an element node for ARIA attributes on elements with a destructive
 * role (none/presentation) and reports violations with autofix.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  // 1. Get static value of role attribute
  const role = getStaticAttributeValue(node, "role");

  // If null (missing or dynamic), return early — we can't determine the role
  if (role === null) return;

  // 2. If not a destructive role, return early
  if (!DESTRUCTIVE_ROLES.has(role.toLowerCase())) return;

  // 3. Collect all aria-* attributes
  const ariaAttrs = getAriaAttributes(node);

  // 4. For each aria-* attribute, report if static
  for (const { name, attrNode } of ariaAttrs) {
    // Skip dynamic values — we cannot safely analyse or autofix them.
    if (isDynamicValue(node, name)) continue;

    // Skip if we cannot read a static value (missing or unresolvable).
    if (getStaticAttributeValue(node, name) === null) continue;

    const reportNode = getAttributeNode(node, name) ?? attrNode;
    context.report({
      node: reportNode,
      messageId: "ariaOnNonSemantic",
      data: { attribute: name, role: role.toLowerCase() },
      fix(fixer) {
        if (reportNode) {
          return removeAttribute(context, fixer, reportNode);
        }
        return null;
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Rule definition
// ---------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow ARIA attributes on elements with role=\"none\" or role=\"presentation\"",
    },
    fixable: "code",
    schema: [],
    messages: {
      ariaOnNonSemantic:
        'The attribute "{{attribute}}" has no effect on an element with role="{{role}}". Remove the attribute.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
