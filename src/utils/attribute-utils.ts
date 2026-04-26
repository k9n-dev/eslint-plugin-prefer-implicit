/**
 * Parser-agnostic attribute utilities for reading element names and attribute
 * values from AST nodes produced by different ESLint parsers.
 *
 * Supported AST shapes:
 *   - ESTree/JSX  (JSXOpeningElement, JSXAttribute)
 *   - Vue         (VElement, VAttribute)
 *   - Angular     (Element with TextAttribute / BoundAttribute)
 *   - HTML        (Tag / Element with string attribute values)
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Safely retrieves the list of attribute nodes from an element node,
 * regardless of which parser produced it.
 */
function getAttributes(node: any): any[] {
  if (!node) return [];

  // JSX: attributes live directly on JSXOpeningElement
  if (node.type === "JSXOpeningElement" && Array.isArray(node.attributes)) {
    return node.attributes;
  }

  // Vue: attributes live on startTag.attributes or directly on node.attributes
  if (node.type === "VElement") {
    if (node.startTag && Array.isArray(node.startTag.attributes)) {
      return node.startTag.attributes;
    }
    if (Array.isArray(node.attributes)) {
      return node.attributes;
    }
    return [];
  }

  // Angular / HTML: attributes may be on node.attributes or node.attrs
  if (Array.isArray(node.attributes)) {
    return node.attributes;
  }
  if (Array.isArray(node.attrs)) {
    return node.attrs;
  }

  return [];
}

/**
 * Returns the attribute name string for a given attribute AST node.
 */
function getAttrName(attr: any): string | null {
  if (!attr) return null;

  // JSX: attr.name can be JSXIdentifier or JSXNamespacedName
  if (attr.type === "JSXAttribute") {
    if (attr.name && attr.name.type === "JSXIdentifier") {
      return attr.name.name ?? null;
    }
    if (attr.name && attr.name.type === "JSXNamespacedName") {
      const ns = attr.name.namespace?.name ?? "";
      const local = attr.name.name?.name ?? "";
      return ns && local ? `${ns}:${local}` : null;
    }
    return null;
  }

  // Vue: VAttribute — attr.key.name holds the attribute name
  if (attr.type === "VAttribute") {
    if (attr.key && typeof attr.key.name === "string") {
      return attr.key.name;
    }
    if (attr.key && attr.key.rawName && typeof attr.key.rawName === "string") {
      return attr.key.rawName;
    }
    return null;
  }

  // Angular TextAttribute / BoundAttribute
  if (
    (attr.type === "TextAttribute" || attr.type === "BoundAttribute") &&
    typeof attr.name === "string"
  ) {
    return attr.name;
  }

  // Generic HTML attribute objects: { name: string, value: string }
  if (typeof attr.name === "string") {
    return attr.name;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Returns the lowercase tag name of an element node, or `null` if it cannot
 * be determined (e.g. a component reference like `<MyButton>`).
 */
export function getElementName(node: any): string | null {
  if (!node) return null;

  // JSX: JSXOpeningElement → node.name
  if (node.type === "JSXOpeningElement") {
    if (node.name && node.name.type === "JSXIdentifier") {
      const name: string = node.name.name;
      // HTML elements start with a lowercase letter; components start uppercase
      if (name.length > 0 && name[0] === name[0].toLowerCase() && name[0] !== name[0].toUpperCase()) {
        return name.toLowerCase();
      }
      return null; // Component name
    }
    // JSXMemberExpression or JSXNamespacedName → component, skip
    return null;
  }

  // Vue: VElement → rawName or name
  if (node.type === "VElement") {
    const raw = node.rawName ?? node.name;
    if (typeof raw === "string" && raw.length > 0) {
      return raw.toLowerCase();
    }
    return null;
  }

  // Angular / HTML: check tagName or name
  if (typeof node.tagName === "string" && node.tagName.length > 0) {
    return node.tagName.toLowerCase();
  }
  if (typeof node.name === "string" && node.name.length > 0) {
    // Guard against component-like names (uppercase first letter) in
    // generic element nodes — only return if it looks like an HTML tag
    const n = node.name;
    if (n[0] === n[0].toLowerCase() && n[0] !== n[0].toUpperCase()) {
      return n.toLowerCase();
    }
    return null;
  }

  return null;
}

/**
 * Returns the static string value of an attribute, or `null` if the attribute
 * is missing or its value is dynamic (binding, expression, etc.).
 */
export function getStaticAttributeValue(
  node: any,
  attributeName: string,
): string | null {
  const attr = getAttributeNode(node, attributeName);
  if (!attr) return null;

  // JSX: JSXAttribute
  if (attr.type === "JSXAttribute") {
    // Boolean attribute (e.g. <button disabled />) — no string value
    if (attr.value === null || attr.value === undefined) {
      return null;
    }
    // Literal string value
    if (attr.value.type === "Literal" && typeof attr.value.value === "string") {
      return attr.value.value;
    }
    // JSXExpressionContainer → dynamic
    if (attr.value.type === "JSXExpressionContainer") {
      return null;
    }
    return null;
  }

  // Vue: VAttribute
  if (attr.type === "VAttribute") {
    // Directive (v-bind, :attr, etc.) → dynamic
    if (attr.directive === true) {
      return null;
    }
    // Static literal
    if (attr.value && attr.value.type === "VLiteral") {
      return typeof attr.value.value === "string" ? attr.value.value : null;
    }
    // No value node → boolean attribute
    if (!attr.value) {
      return null;
    }
    return null;
  }

  // Angular: TextAttribute is static, BoundAttribute is dynamic
  if (attr.type === "TextAttribute") {
    return typeof attr.value === "string" ? attr.value : null;
  }
  if (attr.type === "BoundAttribute") {
    return null;
  }

  // Generic HTML attribute: { name, value }
  if (typeof attr.value === "string") {
    return attr.value;
  }

  return null;
}

/**
 * Returns `true` if the attribute exists on the node, regardless of whether
 * its value is static or dynamic.
 */
export function hasAttribute(node: any, attributeName: string): boolean {
  return getAttributeNode(node, attributeName) !== null;
}

/**
 * Returns `true` if the attribute value is dynamic (bound via framework syntax).
 * Returns `false` if the attribute is not found or is static.
 */
export function isDynamicValue(node: any, attributeName: string): boolean {
  const attr = getAttributeNode(node, attributeName);
  if (!attr) return false;

  // JSX: dynamic if value is a JSXExpressionContainer
  if (attr.type === "JSXAttribute") {
    return (
      attr.value !== null &&
      attr.value !== undefined &&
      attr.value.type === "JSXExpressionContainer"
    );
  }

  // Vue: dynamic if it's a directive
  if (attr.type === "VAttribute") {
    return attr.directive === true;
  }

  // Angular: dynamic if it's a BoundAttribute
  if (attr.type === "BoundAttribute") {
    return true;
  }

  return false;
}

/**
 * Returns the AST node for a specific attribute, or `null` if not found.
 * Used by the autofix engine to get the range for removal.
 */
export function getAttributeNode(node: any, attributeName: string): any | null {
  const attrs = getAttributes(node);

  for (const attr of attrs) {
    const name = getAttrName(attr);
    if (name !== null && name.toLowerCase() === attributeName.toLowerCase()) {
      return attr;
    }
  }

  return null;
}
