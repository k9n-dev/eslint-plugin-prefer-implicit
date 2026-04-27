/**
 * Rule: no-unsupported-aria
 *
 * Disallow ARIA attributes that are not supported by an element's effective
 * role. For example, `<button aria-valuenow="5">` is invalid because the
 * "button" role does not support `aria-valuenow`.
 *
 * The effective role is determined by:
 *   1. An explicit static `role` attribute, or
 *   2. The element's implicit role from `IMPLICIT_ROLE_MAP`.
 *
 * Elements with no determinable role and roles not present in
 * `SUPPORTED_ARIA_BY_ROLE` are silently skipped.
 */

import type { Rule } from "eslint";
import {
  IMPLICIT_ROLE_MAP,
  SUPPORTED_ARIA_BY_ROLE,
} from "../utils/aria-data.js";
import {
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
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
 * Checks an element node for ARIA attributes that are not supported by the
 * element's effective role and reports violations with autofix.
 */
function checkElement(context: Rule.RuleContext, node: any): void {
  const elementName = getElementName(node);

  // Determine effective role: explicit static role first, then implicit.
  let effectiveRole: string | null = null;

  const explicitRole = getStaticAttributeValue(node, "role");
  if (explicitRole !== null) {
    effectiveRole = explicitRole.toLowerCase();
  } else if (elementName !== null) {
    const entry = IMPLICIT_ROLE_MAP[elementName];
    if (entry) {
      // Check condition (e.g. <a> requires href for implicit role "link")
      if (entry.condition) {
        if (hasAttribute(node, entry.condition.attribute)) {
          effectiveRole = entry.role;
        }
      } else {
        effectiveRole = entry.role;
      }
    }
  }

  if (effectiveRole === null) return;

  const supportedSet = SUPPORTED_ARIA_BY_ROLE[effectiveRole];
  if (!supportedSet) return; // Unknown role — skip silently.

  // Iterate all aria-* attributes on the node.
  const ariaAttrs = getAriaAttributes(node);

  for (const { name, attrNode } of ariaAttrs) {
    // Skip dynamic values — we cannot safely analyse or autofix them.
    if (isDynamicValue(node, name)) continue;

    // Also skip if we cannot read a static value (missing or unresolvable).
    if (getStaticAttributeValue(node, name) === null) continue;

    if (!supportedSet.has(name)) {
      const reportNode = getAttributeNode(node, name) ?? attrNode;
      context.report({
        node: reportNode,
        messageId: "unsupportedAria",
        data: { attribute: name, role: effectiveRole },
        fix(fixer) {
          if (reportNode) {
            return removeAttribute(context, fixer, reportNode);
          }
          return null;
        },
      });
    }
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
        "Disallow ARIA attributes not supported by the element's role",
    },
    fixable: "code",
    schema: [],
    messages: {
      unsupportedAria:
        'The attribute "{{attribute}}" is not supported by the "{{role}}" role. Remove the unsupported attribute.',
    },
  },
  create(context) {
    return createElementVisitors(context, checkElement);
  },
};

export default rule;
