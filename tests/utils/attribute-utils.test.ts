import { describe, it, expect } from "vitest";
import {
  getElementName,
  getStaticAttributeValue,
  hasAttribute,
  isDynamicValue,
  getAttributeNode,
} from "../../src/utils/attribute-utils.js";

// ---------------------------------------------------------------------------
// Mock AST node factories
// ---------------------------------------------------------------------------

/** Creates a JSXOpeningElement node with the given tag name and attributes. */
function jsxElement(
  tagName: string,
  attributes: any[] = [],
  isComponent = false,
): any {
  const name = isComponent
    ? tagName // Component names start uppercase, handled by getElementName
    : tagName;
  return {
    type: "JSXOpeningElement",
    name: { type: "JSXIdentifier", name },
    attributes,
  };
}

/** Creates a JSXAttribute with a Literal string value. */
function jsxAttr(name: string, value: string): any {
  return {
    type: "JSXAttribute",
    name: { type: "JSXIdentifier", name },
    value: { type: "Literal", value },
  };
}

/** Creates a JSXAttribute with a JSXExpressionContainer (dynamic). */
function jsxDynamicAttr(name: string): any {
  return {
    type: "JSXAttribute",
    name: { type: "JSXIdentifier", name },
    value: {
      type: "JSXExpressionContainer",
      expression: { type: "Identifier", name: "someVar" },
    },
  };
}

/** Creates a JSXAttribute with no value (boolean attribute like `disabled`). */
function jsxBooleanAttr(name: string): any {
  return {
    type: "JSXAttribute",
    name: { type: "JSXIdentifier", name },
    value: null,
  };
}

/** Creates a Vue VElement node. */
function vueElement(tagName: string, attributes: any[] = []): any {
  return {
    type: "VElement",
    rawName: tagName,
    name: tagName.toLowerCase(),
    startTag: { attributes },
  };
}

/** Creates a Vue VAttribute with a static VLiteral value. */
function vueAttr(name: string, value: string): any {
  return {
    type: "VAttribute",
    directive: false,
    key: { name },
    value: { type: "VLiteral", value },
  };
}

/** Creates a Vue VAttribute directive (dynamic binding). */
function vueDirectiveAttr(name: string): any {
  return {
    type: "VAttribute",
    directive: true,
    key: { name },
    value: { type: "VExpressionContainer" },
  };
}

/** Creates an Angular-style element node. */
function angularElement(tagName: string, attributes: any[] = []): any {
  return {
    type: "Element$1",
    name: tagName,
    attributes,
  };
}

/** Creates an Angular TextAttribute (static). */
function angularTextAttr(name: string, value: string): any {
  return {
    type: "TextAttribute",
    name,
    value,
  };
}

/** Creates an Angular BoundAttribute (dynamic). */
function angularBoundAttr(name: string): any {
  return {
    type: "BoundAttribute",
    name,
  };
}

/** Creates a generic HTML element node. */
function htmlElement(tagName: string, attributes: any[] = []): any {
  return {
    type: "Tag",
    name: tagName,
    attributes,
  };
}

/** Creates a generic HTML attribute with a string value. */
function htmlAttr(name: string, value: string): any {
  return { name, value };
}

// ---------------------------------------------------------------------------
// getElementName
// ---------------------------------------------------------------------------

describe("getElementName", () => {
  describe("JSX nodes", () => {
    it("returns lowercase tag name for HTML elements", () => {
      const node = jsxElement("button");
      expect(getElementName(node)).toBe("button");
    });

    it("returns lowercase for uppercase HTML tags", () => {
      // Lowercase first char → treated as HTML element
      const node = jsxElement("div");
      expect(getElementName(node)).toBe("div");
    });

    it("returns null for component names (uppercase first letter)", () => {
      const node = jsxElement("MyButton", [], true);
      expect(getElementName(node)).toBeNull();
    });

    it("returns null for JSXMemberExpression", () => {
      const node = {
        type: "JSXOpeningElement",
        name: { type: "JSXMemberExpression" },
        attributes: [],
      };
      expect(getElementName(node)).toBeNull();
    });

    it("returns null for JSXNamespacedName", () => {
      const node = {
        type: "JSXOpeningElement",
        name: { type: "JSXNamespacedName" },
        attributes: [],
      };
      expect(getElementName(node)).toBeNull();
    });
  });

  describe("Vue nodes", () => {
    it("returns lowercase tag name from rawName", () => {
      const node = vueElement("Button");
      // rawName is "Button", but getElementName lowercases it
      expect(getElementName(node)).toBe("button");
    });

    it("returns lowercase tag name for standard elements", () => {
      const node = vueElement("nav");
      expect(getElementName(node)).toBe("nav");
    });
  });

  describe("Angular / HTML nodes", () => {
    it("returns lowercase tag name from tagName property", () => {
      const node = { tagName: "BUTTON" };
      expect(getElementName(node)).toBe("button");
    });

    it("returns lowercase tag name from name property", () => {
      const node = angularElement("input");
      expect(getElementName(node)).toBe("input");
    });

    it("returns null for component-like names via name property", () => {
      // Uppercase first letter in generic node.name → component
      const node = { name: "AppHeader" };
      expect(getElementName(node)).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("returns null for null input", () => {
      expect(getElementName(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(getElementName(undefined)).toBeNull();
    });

    it("returns null for empty object", () => {
      expect(getElementName({})).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// getStaticAttributeValue
// ---------------------------------------------------------------------------

describe("getStaticAttributeValue", () => {
  describe("JSX literal attributes", () => {
    it("returns the string value for a Literal attribute", () => {
      const node = jsxElement("button", [jsxAttr("role", "button")]);
      expect(getStaticAttributeValue(node, "role")).toBe("button");
    });

    it("returns the value for aria-* attributes", () => {
      const node = jsxElement("div", [jsxAttr("aria-hidden", "true")]);
      expect(getStaticAttributeValue(node, "aria-hidden")).toBe("true");
    });

    it("returns empty string for empty attribute value", () => {
      const node = jsxElement("div", [jsxAttr("aria-label", "")]);
      expect(getStaticAttributeValue(node, "aria-label")).toBe("");
    });

    it("returns null for missing attribute", () => {
      const node = jsxElement("button", []);
      expect(getStaticAttributeValue(node, "role")).toBeNull();
    });

    it("returns null for boolean JSX attribute (no value)", () => {
      const node = jsxElement("button", [jsxBooleanAttr("disabled")]);
      expect(getStaticAttributeValue(node, "disabled")).toBeNull();
    });
  });

  describe("JSX dynamic expressions", () => {
    it("returns null for JSXExpressionContainer", () => {
      const node = jsxElement("button", [jsxDynamicAttr("role")]);
      expect(getStaticAttributeValue(node, "role")).toBeNull();
    });
  });

  describe("Vue static attributes", () => {
    it("returns the string value for a VLiteral attribute", () => {
      const node = vueElement("button", [vueAttr("role", "button")]);
      expect(getStaticAttributeValue(node, "role")).toBe("button");
    });

    it("returns null for a Vue directive (dynamic binding)", () => {
      const node = vueElement("button", [vueDirectiveAttr("role")]);
      expect(getStaticAttributeValue(node, "role")).toBeNull();
    });

    it("returns null for a Vue boolean attribute (no value node)", () => {
      const attr = {
        type: "VAttribute",
        directive: false,
        key: { name: "disabled" },
        value: undefined,
      };
      const node = vueElement("button", [attr]);
      expect(getStaticAttributeValue(node, "disabled")).toBeNull();
    });
  });

  describe("Angular attributes", () => {
    it("returns the string value for a TextAttribute", () => {
      const node = angularElement("button", [
        angularTextAttr("role", "button"),
      ]);
      expect(getStaticAttributeValue(node, "role")).toBe("button");
    });

    it("returns null for a BoundAttribute", () => {
      const node = angularElement("button", [angularBoundAttr("role")]);
      expect(getStaticAttributeValue(node, "role")).toBeNull();
    });
  });

  describe("HTML attributes", () => {
    it("returns the string value for a plain attribute", () => {
      const node = htmlElement("button", [htmlAttr("role", "button")]);
      expect(getStaticAttributeValue(node, "role")).toBe("button");
    });

    it("returns empty string for empty HTML attribute value", () => {
      const node = htmlElement("div", [htmlAttr("aria-label", "")]);
      expect(getStaticAttributeValue(node, "aria-label")).toBe("");
    });
  });

  describe("case insensitivity", () => {
    it("matches attribute names case-insensitively", () => {
      const node = jsxElement("div", [jsxAttr("ROLE", "button")]);
      expect(getStaticAttributeValue(node, "role")).toBe("button");
    });

    it("matches mixed-case attribute names", () => {
      const node = jsxElement("div", [jsxAttr("aria-Hidden", "true")]);
      expect(getStaticAttributeValue(node, "aria-hidden")).toBe("true");
    });
  });
});

// ---------------------------------------------------------------------------
// isDynamicValue
// ---------------------------------------------------------------------------

describe("isDynamicValue", () => {
  describe("JSX", () => {
    it("returns true for JSXExpressionContainer", () => {
      const node = jsxElement("button", [jsxDynamicAttr("role")]);
      expect(isDynamicValue(node, "role")).toBe(true);
    });

    it("returns false for Literal value", () => {
      const node = jsxElement("button", [jsxAttr("role", "button")]);
      expect(isDynamicValue(node, "role")).toBe(false);
    });

    it("returns false for missing attribute", () => {
      const node = jsxElement("button", []);
      expect(isDynamicValue(node, "role")).toBe(false);
    });

    it("returns false for boolean attribute (null value)", () => {
      const node = jsxElement("button", [jsxBooleanAttr("disabled")]);
      expect(isDynamicValue(node, "disabled")).toBe(false);
    });
  });

  describe("Vue", () => {
    it("returns true for directive attribute", () => {
      const node = vueElement("button", [vueDirectiveAttr("role")]);
      expect(isDynamicValue(node, "role")).toBe(true);
    });

    it("returns false for static VAttribute", () => {
      const node = vueElement("button", [vueAttr("role", "button")]);
      expect(isDynamicValue(node, "role")).toBe(false);
    });
  });

  describe("Angular", () => {
    it("returns true for BoundAttribute", () => {
      const node = angularElement("button", [angularBoundAttr("role")]);
      expect(isDynamicValue(node, "role")).toBe(true);
    });

    it("returns false for TextAttribute", () => {
      const node = angularElement("button", [
        angularTextAttr("role", "button"),
      ]);
      expect(isDynamicValue(node, "role")).toBe(false);
    });
  });

  describe("HTML", () => {
    it("returns false for plain HTML attributes", () => {
      const node = htmlElement("button", [htmlAttr("role", "button")]);
      expect(isDynamicValue(node, "role")).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// hasAttribute
// ---------------------------------------------------------------------------

describe("hasAttribute", () => {
  it("returns true when attribute exists (JSX)", () => {
    const node = jsxElement("a", [jsxAttr("href", "#")]);
    expect(hasAttribute(node, "href")).toBe(true);
  });

  it("returns false when attribute is missing (JSX)", () => {
    const node = jsxElement("a", []);
    expect(hasAttribute(node, "href")).toBe(false);
  });

  it("returns true for dynamic attributes (JSX)", () => {
    const node = jsxElement("button", [jsxDynamicAttr("role")]);
    expect(hasAttribute(node, "role")).toBe(true);
  });

  it("returns true when attribute exists (Vue)", () => {
    const node = vueElement("a", [vueAttr("href", "#")]);
    expect(hasAttribute(node, "href")).toBe(true);
  });

  it("returns true when attribute exists (Angular)", () => {
    const node = angularElement("a", [angularTextAttr("href", "#")]);
    expect(hasAttribute(node, "href")).toBe(true);
  });

  it("returns true when attribute exists (HTML)", () => {
    const node = htmlElement("a", [htmlAttr("href", "#")]);
    expect(hasAttribute(node, "href")).toBe(true);
  });

  it("matches attribute names case-insensitively", () => {
    const node = jsxElement("div", [jsxAttr("ARIA-HIDDEN", "true")]);
    expect(hasAttribute(node, "aria-hidden")).toBe(true);
  });

  it("returns false for null node", () => {
    expect(hasAttribute(null, "role")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getAttributeNode
// ---------------------------------------------------------------------------

describe("getAttributeNode", () => {
  it("returns the attribute node when found (JSX)", () => {
    const attr = jsxAttr("role", "button");
    const node = jsxElement("button", [attr]);
    expect(getAttributeNode(node, "role")).toBe(attr);
  });

  it("returns null when attribute is not found (JSX)", () => {
    const node = jsxElement("button", []);
    expect(getAttributeNode(node, "role")).toBeNull();
  });

  it("returns the correct attribute among multiple (JSX)", () => {
    const roleAttr = jsxAttr("role", "button");
    const ariaAttr = jsxAttr("aria-label", "Click me");
    const node = jsxElement("button", [roleAttr, ariaAttr]);
    expect(getAttributeNode(node, "role")).toBe(roleAttr);
    expect(getAttributeNode(node, "aria-label")).toBe(ariaAttr);
  });

  it("returns the attribute node when found (Vue)", () => {
    const attr = vueAttr("role", "navigation");
    const node = vueElement("nav", [attr]);
    expect(getAttributeNode(node, "role")).toBe(attr);
  });

  it("returns the attribute node when found (Angular)", () => {
    const attr = angularTextAttr("role", "button");
    const node = angularElement("button", [attr]);
    expect(getAttributeNode(node, "role")).toBe(attr);
  });

  it("returns the attribute node when found (HTML)", () => {
    const attr = htmlAttr("role", "button");
    const node = htmlElement("button", [attr]);
    expect(getAttributeNode(node, "role")).toBe(attr);
  });

  it("matches attribute names case-insensitively", () => {
    const attr = jsxAttr("ROLE", "button");
    const node = jsxElement("button", [attr]);
    expect(getAttributeNode(node, "role")).toBe(attr);
  });

  it("returns null for null node", () => {
    expect(getAttributeNode(null, "role")).toBeNull();
  });

  it("returns null for node with no attributes", () => {
    expect(getAttributeNode({}, "role")).toBeNull();
  });
});
